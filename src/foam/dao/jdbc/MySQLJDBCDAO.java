/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.dao.jdbc;

import foam.core.*;
import foam.dao.Sink;
import foam.nanos.logger.Logger;
import foam.mlang.order.Comparator;
import foam.mlang.predicate.Predicate;
import java.sql.*;
import java.sql.SQLException;
import java.util.*;

/**
  We assume that the database is created by a script when the system starts the first time.
  When the system restarts at any point in time it should verify that the database is already created otherwise it should create it.
  When creating the database, we only do a CREATE SCHEMA sql instruction, then we create the app user and password and grant him full privileges on this database.
  Any other database objects (tables) will be created on the fly by the application (when methods of this class are called).

 */
public class MySQLJDBCDAO extends AbstractJDBCDAO{

  public MySQLJDBCDAO(X x, ClassInfo of, String poolName) throws java.sql.SQLException, ClassNotFoundException {
    super(x, of, poolName);
  }

  @Override
  public FObject put_(X x, FObject obj) {
    Connection c = null;
    IndexedPreparedStatement stmt = null;
    ResultSet resultSet = null;

    try {
      c = dataSource_.getConnection();
      StringBuilder builder = threadLocalBuilder_.get()
        .append("insert into ")
        .append(tableName_);

      buildFormattedColumnNames(obj, builder);
      builder.append(" values");
      buildFormattedColumnPlaceholders(obj, builder);
      builder.append(" on duplicate key ")
        // .append(getPrimaryKey().createStatement()) ... Not in MySQL
        .append(" update ");
      buildUpdateFormattedColumnNames(obj, builder);   // Specific to MySQL

      stmt = new IndexedPreparedStatement(c.prepareStatement(builder.toString(),
        Statement.RETURN_GENERATED_KEYS));

      setStatementValues(stmt, obj);

      int inserted = stmt.executeUpdate();
      if ( inserted == 0 ) {
        throw new SQLException("Error performing put_ command");
      }

      // get auto-generated postgres keys
/*       resultSet = stmt.getGeneratedKeys();
      if ( resultSet.next() ) {
        obj.setProperty(getPrimaryKey().getName(), resultSet.getObject(1));
      } */

      return obj;
    } catch (Throwable e) {
      Logger logger = (Logger) x.get("logger");
      logger.error(e);
      return null;
    } finally {
      closeAllQuietly(resultSet, stmt);
    }
  }

  @Override
  public Sink select_(X x, Sink sink, long skip, long limit, Comparator order, Predicate predicate) {
    sink = prepareSink(sink);

    Connection               c         = null;
    IndexedPreparedStatement stmt      = null;
    ResultSet                resultSet = null;

    try {
      c = dataSource_.getConnection();

      StringBuilder builder = threadLocalBuilder_.get()
        .append("select * from ")
        .append(tableName_);

      if ( predicate != null ) {
        builder.append(" where ")
          .append(predicate.createStatement());
      }

      if ( order != null ) {
        builder.append(" order by ")
          .append(order.createStatement());
      }

      if ( limit > 0 && limit < this.MAX_SAFE_INTEGER ) {
        builder.append(" limit ").append(limit);
      }

      if ( skip > 0 && skip < this.MAX_SAFE_INTEGER ) {
        builder.append(" offset ").append(skip);
      }

      stmt = new IndexedPreparedStatement(c.prepareStatement(builder.toString()));

      if ( predicate != null ) {
        predicate.prepareStatement(stmt);
      }

      resultSet = stmt.executeQuery(); // ???
      while ( resultSet.next() ) {
        sink.put(createFObject(resultSet), null);
      }

      return sink;
    } catch (Throwable e) {
      Logger logger = (Logger) x.get("logger");
      logger.error(e);
      return null;
    } finally {
      closeAllQuietly(resultSet, stmt);
    }
  }

  /**
   * Create the table in the database and return true if it doesn't already exist otherwise it does nothing and returns false
   * @param of ClassInfo
   */
  @Override
  public boolean maybeCreateTable(X x, ClassInfo of) {
    Connection c = null;
    IndexedPreparedStatement stmt = null;
    ResultSet resultSet = null;

    try {
      c = dataSource_.getConnection();
      DatabaseMetaData meta = c.getMetaData();
      resultSet = meta.getTables(null, null, tableName_, new String[]{"TABLE"});
      if ( resultSet.isBeforeFirst() ) {
        // found a table, don't create
        return false;
      }

      StringBuilder builder =threadLocalBuilder_.get()
        .append("CREATE TABLE ")
        .append(tableName_)
        .append("(")
        .append(getPrimaryKey().createStatement())
        .append(" ")
        .append(getPrimaryKey().getSQLType())
        .append(" primary key,");

      Iterator i = properties_.iterator();
      while ( i.hasNext() ) {
        PropertyInfo prop = (PropertyInfo) i.next();

        // Why you skip the primary key? (Ask Kevin)
        if ( getPrimaryKey().getName().equals(prop.getName()) )
          continue;

        builder.append(prop.createStatement())
          .append(" ")
          .append(prop.getSQLType()); // TODO: is getSQLType guaranteed to return something?

        if ( i.hasNext() ) {
          builder.append(",");
        }
      }
      builder.append(")");

      // execute statement
      stmt = new IndexedPreparedStatement(c.prepareStatement(builder.toString()));
      stmt.executeUpdate();
      return true;
    } catch (Throwable e) {
      Logger logger = (Logger) x.get("logger");
      logger.error(e);
      return false;
    } finally {
      closeAllQuietly(resultSet, stmt);
    }
  }

}
