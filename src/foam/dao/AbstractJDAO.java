/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.dao;

import foam.core.*;
import foam.lib.json.ExprParser;
import foam.lib.json.JSONParser;
import foam.lib.json.Outputter;
import foam.lib.json.OutputterMode;
import foam.lib.parse.*;
import foam.mlang.order.Comparator;
import foam.mlang.predicate.Predicate;
import foam.nanos.auth.User;
import foam.nanos.logger.*;
import foam.util.SafetyUtil;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.regex.Pattern;
import java.util.TimeZone;
import java.util.List;
import java.util.Iterator;

public abstract class AbstractJDAO
  extends ProxyDAO
{
  protected Pattern COMMENT = Pattern.compile("(/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/)|(//.*)");
  protected static final ThreadLocal<SimpleDateFormat> sdf = new ThreadLocal<SimpleDateFormat>() {
    @Override
    protected SimpleDateFormat initialValue() {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
      sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
      return sdf;
    }
  };

  protected final File           outFile_;
  protected final BufferedWriter out_;
  protected       Logger         logger_ = new StdoutLogger();

  public AbstractJDAO(foam.core.X x, ClassInfo classInfo, String filename) {
    this(x, new MapDAO(classInfo), filename);
    setOf(classInfo);
  }

  public AbstractJDAO(foam.core.X x, DAO delegate, String filename){
    setX(x);
    setOf(delegate.getOf());
    setDelegate(delegate);
    Logger logger = logger_;

    if ( x != null ) {
      logger = (Logger) x.get("logger");

      if ( logger == null ) logger = logger_;
    }

    logger_ = new PrefixLogger(new Object[] { "[JDAO]", filename }, logger);
    try {
      //get repo entries in filename.0 journal first
      File inFile = getX().get(foam.nanos.fs.Storage.class).get(filename + ".0");
      //load repo entries into DAO
      if ( inFile.exists() ) loadJournal(inFile);

      //get output journal
      outFile_ = getX().get(foam.nanos.fs.Storage.class).get(filename);
      //if output journal does not existing, create one
      if ( ! outFile_.exists() ) {
        //if output journal does not exist, create one
        outFile_.createNewFile();
      } else {
        //if output journal file exists, load entries into DAO
        loadJournal(outFile_);
      }
      //link output journal file to BufferedWriter
      out_ = new BufferedWriter(new FileWriter(outFile_, true));
      out_.newLine();
    } catch ( IOException e ) {
      logger_.error(e);
      throw new RuntimeException(e);
    }
  }

  protected abstract Outputter getOutputter();

  protected void loadJournal(File file)
      throws IOException
  {
    JSONParser parser = getX().create(JSONParser.class);
    BufferedReader br = new BufferedReader(new FileReader(file));

    for ( String line ; ( line = br.readLine() ) != null ; ) {
      // skip empty lines & comment lines
      if ( SafetyUtil.isEmpty(line) ) continue;
      if ( COMMENT.matcher(line).matches() ) continue;

      try {
        char operation = line.charAt(0);
        // remove first two characters and last character
        line = line.trim().substring(2, line.trim().length() - 1);

        FObject object = parser.parseString(line);
        if ( object == null ) {
          logger_.error("parse error", getParsingErrorMessage(line), "line:", line);
          continue;
        }

        switch ( operation ) {
          case 'p':
            PropertyInfo id = (PropertyInfo) getOf().getAxiomByName("id");
            if ( getDelegate().find(id.get(object)) != null ) {
              //If data exists, merge difference
              //get old date
              FObject old = getDelegate().find(id.get(object));
              //merge difference
              object = mergeChange(old, object);
            }
            getDelegate().put(object);
            break;
          case 'r':
            getDelegate().remove(object);
            break;
        }
      } catch (Throwable t) {
        logger_.error("error replaying journal line:", line, t);
      }
    }

    br.close();
  }

  /**
   * Gets the result of a failed parsing of a journal line
   * @param line the line that was failed to be parse
   * @return the error message
   */
  protected String getParsingErrorMessage(String line) {
    Parser        parser = new ExprParser();
    PStream       ps     = new StringPStream();
    ParserContext x      = new ParserContextImpl();

    ((StringPStream) ps).setString(line);
    x.set("X", ( getX() == null ) ? new ProxyX() : getX());

    ErrorReportingPStream eps = new ErrorReportingPStream(ps);
    ps = eps.apply(parser, x);
    return eps.getMessage();
  }

  protected void writeComment(User user) throws IOException {
    out_.write("// Modified by ");
    out_.write(user.getFirstName());
    if ( ! SafetyUtil.isEmpty(user.getLastName()) ) {
      out_.write(" ");
      out_.write(user.getLastName());
    }
    out_.write(" (");
    out_.write(String.valueOf(user.getId()));
    out_.write(")");
    out_.write(" at ");
    out_.write(sdf.get().format(Calendar.getInstance().getTime()));
    out_.newLine();
  }

  /**
   * persists data into FileJournal then calls the delegated DAO.
   *
   * @param obj
   * @returns FObject
   */
  @Override
  public FObject put_(X x, FObject obj) {
    PropertyInfo id = (PropertyInfo) getOf().getAxiomByName("id");
    FObject o = getDelegate().find_(x, id.get(obj));
    FObject ret = null;
    String record = null;
    if ( o == null ) {
      //data does not exist
      ret = getDelegate().put_(x, obj);
      //stringify to json string
      record = getOutputter().stringify(ret);
    } else {
      //compare with old data if old data exists
      //get difference FObject
      ret = difference(o, obj);
      //if no difference, then return
      if ( ret == null ) return obj;
      //stringify difference FObject into json string
      record = getOutputter().stringify(ret);
      //put new data into memory
      ret = getDelegate().put_(x, obj);
    }
    try {
      // TODO(drish): supress class name from output
      writeComment((User) x.get("user"));
      out_.write("p(" + record + ")");
      out_.newLine();
      out_.flush();
    } catch (Throwable e) {
      logger_.error("put", e);
    }
    return ret;
  }

  @Override
  public FObject remove_(X x, FObject obj) {
    Object  id  = getPrimaryKey().get(obj);
    FObject ret = getDelegate().remove_(x, obj);

    try {
      writeComment((User) x.get("user"));
      // TODO: Would be more efficient to output the ID portion of the object.  But
      // if ID is an alias or multi part id we should only output the
      // true properties that ID/MultiPartID maps too.
      FObject r = generateFObject(ret);
      PropertyInfo idInfo = (PropertyInfo) getOf().getAxiomByName("id");
      idInfo.set(r, idInfo.get(ret));
      out_.write("r(" + getOutputter().stringify(r) + ")");
      out_.newLine();
      out_.flush();
    } catch (IOException e) {
      logger_.error("remove", e);
    }

    return ret;
  }

  @Override
  public void removeAll_(final X x, long skip, final long limit, Comparator order, Predicate predicate) {
    //     file.delete();

    getDelegate().select_(x, new RemoveSink(x, this), skip, limit, order, predicate);
    getDelegate().removeAll_(x, skip, limit, order, predicate);
  }

  protected FObject difference(FObject o, FObject n) {
    FObject diff = hasDiff(o, n);
    //no difference, then return null
    if ( diff == null ) return null;
    //get the PropertyInfo for the id
    PropertyInfo idInfo = (PropertyInfo) getOf().getAxiomByName("id");
    //set id property to new instance
    idInfo.set(diff, idInfo.get(o));
    return diff;
  }

  protected FObject hasDiff(FObject o, FObject n) {
    // if either new or old is null, return new instance.
    if ( o == null || n == null ) return n;
    // if two instances are same, return new instance because cannot check the difference;
    if ( o == n ) return n;
    FObject ret = null;
    List list = o.getClassInfo().getAxiomsByClass(PropertyInfo.class);
    Iterator e = list.iterator();
    while( e.hasNext() ) {
      PropertyInfo prop = (PropertyInfo) e.next();
      if ( prop instanceof AbstractFObjectPropertyInfo ) {
        FObject diff = hasDiff((FObject) prop.get(o), (FObject) prop.get(n));
        //if there is difference, set difference
        if ( diff != null ) {
          //create only when there is difference
          if ( ret == null ) ret = generateFObject(o);
          //set diff
          prop.set(ret, diff);
        }
      } else if ( prop instanceof AbstractFObjectArrayPropertyInfo ) {
        //TODO: if instances are same, can not check array
        //create only when there is array
        if ( ret == null ) ret = generateFObject(o);
        prop.set(ret, prop.get(n));
      } else if ( ! (prop instanceof AbstractEnumPropertyInfo) && (prop instanceof AbstractObjectPropertyInfo || prop instanceof AbstractArrayPropertyInfo) ) {
        //can not handle reference type except enum
        if ( ret == null ) ret = generateFObject(o);
        prop.set(ret, prop.get(n));
      } else {
        //handle primitive value and enum
        int same = prop.comparePropertyToValue(prop.get(o), prop.get(n));
        if ( same != 0 ) {
          //create only when there is difference
          if ( ret == null ) ret = generateFObject(o);
          prop.set(ret, prop.get(n));
        } 
      }
    }
    return ret;
  }

  protected FObject mergeChange(FObject o, FObject c) {
    //if no change to merge, return FObject;
    if ( c == null ) return o;
    //merge change
    return maybeMerge(o, c);
  }

  protected FObject maybeMerge(FObject o, FObject c) {
    if ( o == null ) return o = c;
    //get PropertyInfos
    List list = o.getClassInfo().getAxiomsByClass(PropertyInfo.class);
    Iterator e = list.iterator();
    while ( e.hasNext() ) {
      PropertyInfo prop = (PropertyInfo) e.next();
      if ( prop instanceof AbstractFObjectPropertyInfo ) {
        //do nested merge
        //check if change
        if ( ! prop.isSet(c) ) continue;
        maybeMerge((FObject) prop.get(o), (FObject) prop.get(c));
      } else {
        //check if change
        if ( ! prop.isSet(c) ) continue;
        //set new value
        prop.set(o, prop.get(c));
      }
    }
    return o;
  }

  //return a new Fobject
  protected FObject generateFObject(FObject o) {
    try {
      ClassInfo classInfo = o.getClassInfo();
      //create a new Instance
      FObject ret = (FObject) classInfo.getObjClass().newInstance();
      return ret;
    } catch ( Throwable t ) {
      throw new RuntimeException(t);
    }
  }
}
