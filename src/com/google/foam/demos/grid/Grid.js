/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// http://www.discoversdk.com/blog/grid-control-with-different-javascript-frameworks

foam.CLASS({
  package: 'com.google.foam.demos.grid',
  name: 'Resource',

  tableProperties: [ 'description', 'url' ],

  properties: [
    { name: 'id', hidden: true },
    { name: 'description', label: 'Description: ' },
    { name: 'url',         label: 'URL: ' }
  ]
});


foam.CLASS({
  package: 'com.google.foam.demos.grid',
  name: 'Controller',
  extends: 'foam.u2.Controller',

  requires: [
    'foam.u2.DetailView',
    'foam.u2.TableView',
    'com.google.foam.demos.grid.Resource'
  ],

  exports: [ 'dao' ],

  axioms: [
    foam.u2.CSS.create({
      code: function() {/*
        body {
          font-family:Arial;
          color:#3a3a3a;
        }
        ^list table {
          border:none;
          text-align:left;
          margin-bottom:20px;
        }
        ^list tr th {
          background-color: #3b97d3;
          color: #fff;
          padding: 5px;
          border-right: solid 1px #3b97d3;
          border-left: solid 1px #fff;
        }
        ^list tr th:first-child {
          border-left: solid 1px #3b97d3;
        }
        ^list tr td {
          padding:5px;
          padding: 5px;
          border-right: solid 1px #d4d4d4;
        }
        ^list tr td:first-child {
          border-left: solid 1px #d4d4d4;
        }
        ^list tr:last-child td {
          border-bottom: solid 1px #d4d4d4;
        }
        input[type="text"] {
          height:20px;
          font-size:14px;
        }
        button, ^ .foam-u2-ActionView {
          border:none;
          color:#fff;
          background:#3b97d3;
          padding:0px 10px;
          height:26px;
          display:inline-block;
          line-height:26px;
          text-decoration:none;
          border-radius:3px;
          -moz-border-radius:3px;
          -webkit-border-radius:3px;
          cursor:pointer;
        }
        ^ button:hover {
          background-color:#73c7ff;
        }
        ^ .foam-u2-DetailView tr {
          display: inline;
        }
      */}
    })
  ],

  properties: [
    {
      name: 'dao',
       view: { class: 'foam.u2.TableView', of: com.google.foam.demos.grid.Resource }
//       view: { class: 'foam.u2.DAOList', of: com.google.foam.demos.grid.Resource, rowView: 'com.google.foam.demos.grid.ResourceView' }
    },
    {
      name: 'person',
      view: 'foam.u2.DetailView',
      factory: function() { return this.Resource.create(); }
    }
  ],

  methods: [
    function initE() {
      this.
        cssClass(this.myCls()). // TODO: needed?
        start('h3').add('Add Resources').end().

        // Use this block to create the form manually
        /*
        add('Description: ').
        start(this.person.DESCRIPTION, {data$: this.person.description$}).end().
        add(' URL: ').
        start(this.person.URL,         {data$: this.person.url$}).end().
        */

        // Or this to use a DetailView
        add(this.PERSON).

        add(this.ADD_RESOURCE).
        start('h3').add('List of Resources').end().

        // Use a Standard TableView
        // add(this.DAO).

        // Or make one manually
        start('table').
          cssClass(this.myCls('list')).
          start('tr').
            start('th').add('Description').end().
            start('th').add('URL').end().
            start('th').end().
          end().
          repeat(this.dao, function(r) {
            var e = this.
              E('tr').
              startContext({data: r}).
                start('td').
                  start('div').add(r.DESCRIPTION).end().
                end().
                start('td').
                  start('div').add(r.URL).end().
                end().
                start('td').
                  start('button').on('click', function() { self.dao.remove(r); }).add('Remove').end().
                end().
              endContext();
              r.propertyChange.sub(function() { self.dao.put(r.clone()); });
              return e;
          }).
       end().

        add(this.SHOW);
    }
  ],

  actions: [
    {
      name: 'addResource',
      label: 'Add',
      code: function() {
        var p = this.person;
        // TODO: remove clone()
        this.dao.put(p.clone());
        p.id = p.description = p.url = undefined;
      }
    },
    {
      name: 'show',
      code: function() {
        console.log('show');
        this.dao.select().then(function(s) {
          window.alert(foam.json.Outputer.create({
            pretty: false,
            outputClassNames: false
          }).stringify(s.a));
        });
      }
    },
    {
      name: 'deleteItem',
      label: 'Delete',
      code: function() {
      }
    }
  ]
});

// Didn't specify view for dao
// Didn't specify 'of' for TableView
// Invalid names in tableProperties:
// added invalid action name, no error
// clone on DAO.put
// width support is missing
