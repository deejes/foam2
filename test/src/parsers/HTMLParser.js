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

describe('HTMLParser', function() {
  var parser;
  var nfcSpecHTML;

  beforeAll(function() {
    parser = foam.parsers.HTMLParser.create();
    nfcSpecHTML = foam.String.multiline(function() {/*
<!DOCTYPE html>
<html>
<head>
  <title>Web NFC API</title>
  <meta charset="UTF-8">
  <script src='https://www.w3.org/Tools/respec/respec-w3c-common'
          class='remove'>
  </script>
  <script class="remove">
    var respecConfig = {
          specStatus:           "CG-DRAFT",
          shortName:            "web-nfc",
          noLegacyStyle:        true,
          publishDate:          "",
          previousPublishDate:  "",
          previousMaturity:     "",
          edDraftURI:           "https://w3c.github.io/web-nfc/",
          crEnd:                "",
          editors: [
            { name: "Kenneth Rohde Christiansen", company: "Intel",
                    companyURL: "http://www.intel.com/" },
            { name: "Zoltan Kis", company: "Intel",
                    companyURL: "http://www.intel.com/" },
          ],
          inlineCSS:    true,
          noIDLIn:      true,
          // extraCSS:     ["../ReSpec.js/css/respec.css"],
          wg:           "Web NFC Community Group",
          wgURI:        "https://www.w3.org/community/web-nfc/",
          wgPublicList: "public-web-nfc",
          issueBase: "https://www.github.com/w3c/web-nfc/issues/",
          githubAPI: "https://api.github.com/repos/w3c/web-nfc",
          otherLinks: [
            {
              key: "Repository",
              data: [{
                    value: "We are on Github.",
                    href: "https://github.com/w3c/web-nfc"
                }, {
                    value: "File a bug.",
                    href: "https://github.com/w3c/web-nfc/issues"
                }, {
                    value: "Commit history.",
                    href: "https://github.com/w3c/web-nfc/commits/gh-pages"
                }, {
                    value: "Usage scenarios",
                    href: "https://w3c.github.io/web-nfc/use-cases.html"
                }
              ]
            },
            {
              key: "Contributors",
              data: [{
                    value: "In the github repository",
                    href: "https://github.com/w3c/web-nfc/graphs/contributors"
                  }
              ]
            },
          ],
          localBiblio: {
            "NFC-SECURITY": {
              href: "https://github.com/w3c/web-nfc/security-privacy.html",
              title: "Web NFC Security and Privacy",
              publisher: "W3C",
              date: "25 April 2015",
            },
            "NFC-USECASES": {
              href: "https://github.com/w3c/web-nfc/use-cases.html",
              title: "Web NFC Use Cases",
              publisher: "W3C",
              date: "25 April 2015",
            },
            "NFC-STANDARDS": {
              href: "http://members.nfc-forum.org/specs/spec_list/",
              title: "NFC Forum Technical Specifications",
              publisher: "NFC Forum",
              date: "24 July 2006"
            },
            "ISO-639.2": {
              href: "https://www.loc.gov/standards/iso639-2/php/code_list.php",
              title: "Codes for the Representation of Names of Languages",
              publisher: "ISO",
              date: "18 March 2014"
            },
            "WEBAPPSEC": {
              href:"https://w3c.github.io/webappsec/specs/powerfulfeatures",
              title: "Secure Contexts",
              publisher: "W3C",
              date: "17 July 2015"
            },
          },
    };
  </script>
  <style>
    table.simple { border: 1px solid #000; }
    table.simple td { border-right: 1px solid #000; }
  </style>
</head>

<body>

<!-- - - - - - - - - - - - - - - - Abstract - - - - - - - - - - - - - - - - -->
<section id="abstract">
  <p>
    Near Field Communication (NFC) enables wireless communication between two
    devices at close proximity, usually less than a few centimeters.
    NFC is an international standard (ISO/IEC 18092) defining an interface and
    protocol for simple wireless interconnection of closely coupled devices
    operating at 13.56 MHz
    (see <a href="https://www.nfc-forum.org/specs/spec_list/">
    https://www.nfc-forum.org/specs/spec_list/</a>).
  </p>
  <p>
    This document defines an API to enable selected use-cases based on
    NFC technology.
  </p>
</section>

<!-- - - - - - - - - - - - Status of this document  - - - - - - - - - - - - -->
<section id="sotd">
  <p>
    Implementers need to be aware that this specification is considered
    unstable.
    Implementers who are not taking part in the discussions will find the
    specification changing out from under them in incompatible ways. Vendors
    interested in implementing this specification before it eventually reaches
    the Candidate Recommendation phase should subscribe to the repository on
    GitHub and take part in the discussions.
  </p>
  <p>
    Significant changes to this document since last publication are
    documented in the <a href="#Changes">Changes section</a>.
  </p>
</section>

<!-- - - - - - - - - - - - - - - Conformance  - - - - - - - - - - - - - - - -->
<section id="conformance">
  <p>
    This document defines conformance criteria that apply to a single
    product: the <dfn>UA</dfn> (user agent) that implements the interfaces it
    contains.
  </p>
  <p>
    Implementations that use ECMAScript to implement the APIs defined in
    this document MUST implement them in a manner consistent with the
    ECMAScript Bindings defined in the Web IDL specification [[!WEBIDL]], as
    this document uses that specification and terminology.
  </p>
</section>

<!-- - - - - - - - - - - - - - -  Terminology - - - - - - - - - - - - - - - -->
<section> <h2>Terminology and conventions</h2>
  <p>
    The terms <a href="http://www.w3.org/TR/url-1/"><dfn>URL</dfn></a> and
    <a href="https://url.spec.whatwg.org/#concept-url-path">
    <dfn>URL path</dfn></a> are defined in [[!URL]].
  </p>
  <p>
    The following terms are defined in [[!HTML5]]:
    <a href="https://html.spec.whatwg.org/#browsing-context">
    <dfn>browsing context</dfn></a>,

    <a href="https://html.spec.whatwg.org/#top-level-browsing-context">
    <dfn>top-level browsing context</dfn></a>,

    <a href="https://html.spec.whatwg.org/multipage/webappapis.html#global-object">
    <dfn>global object</dfn></a>,

    <a href="http://www.w3.org/TR/html5/webappapis.html#incumbent-settings-object">
    <dfn>incumbent settings object</dfn></a>,

    <a href="https://html.spec.whatwg.org/#script-execution-environment">
    <dfn>script execution environment</dfn></a>,

    <a href="https://html.spec.whatwg.org/#document">
    <dfn>Document</dfn></a>,

    <a href="http://www.w3.org/TR/2011/WD-html5-20110113/urls.html#document-base-url">
    <dfn>document base URL</dfn></a>,

    <a href="https://html.spec.whatwg.org/#window">
    <dfn>Window</dfn></a>,

    <a href="https://html.spec.whatwg.org/#windowproxy">
    <dfn>WindowProxy</dfn></a>,

    <a href="https://html.spec.whatwg.org/#origin">
    <dfn>origin</dfn></a>,

    <a href="https://html.spec.whatwg.org/#ascii-serialisation-of-an-origin">
    <dfn>ASCII serialized origin</dfn></a>,

    executing algorithms <a href="https://html.spec.whatwg.org/#in-parallel">
    <dfn>in parallel</dfn></a>,

    <a href="https://html.spec.whatwg.org/#queue-a-task">
    <dfn>queue a task</dfn></a>,

    <a href="https://html.spec.whatwg.org/#task-source">
    <dfn>task source</dfn></a>,

    <a href="https://html.spec.whatwg.org/#the-iframe-element">
    <dfn>iframe</dfn></a>,

    <a href="https://html.spec.whatwg.org/#valid-mime-type">
    <dfn>valid MIME type</dfn></a>.
  </p>
  <p>
    A <a>browsing context</a> refers to the environment in which
    <a>Document</a> objects are presented to the user. A given
    <a>browsing context</a> has a single <code><a>WindowProxy</a></code> object,
    but it can have many <code>Document</code> objects, with their associated
    <code><a>Window</a></code> objects. The <a>script execution environment</a>
    associated with the <i>browsing context</i> identifies the entity which
    invokes this API, which can be a <i>web app</i>, a <i>web page</i>, or an
    <a>iframe</a>.
  </p>
  <p>
    The term
    <a href="https://w3c.github.io/webappsec/specs/powerfulfeatures/#secure-context">
    <dfn>secure context</dfn></a> is defined in [[!WEBAPPSEC]].
  </p>
  <p>
    Inspired by the <a href="https://streams.spec.whatwg.org/#conventions">
    Streams specification</a>, we use the notation <i>x@[[\y]]</i> to refer to
    <a href="http://ecma-international.org/ecma-262/6.0/#sec-object-internal-methods-and-internal-slots">
    <dfn>internal slots</dfn></a> of an object, instead of saying
    <i>"the [[\y]] internal slot of x"</i>.
  </p>
  <p class="note">
    Internal slots are used only as a notation in this specification, and
    implementations do not necessarily have to map them to explicit internal
    properties.
  </p>
  <p>
    The Augmented Backus-Naur Form (ABNF) notation used is specified in
    [[RFC5234]].
  </p>
  <p>
    <a href="http://heycam.github.io/webidl/#idl-DOMString">
      <code><dfn>DOMString</dfn></code></a>,
    <a href="http://heycam.github.io/webidl/#idl-ArrayBuffer">
      <code><dfn>ArrayBuffer</dfn></code></a>,
    <a href="http://heycam.github.io/webidl/#common-BufferSource">
      <code><dfn>BufferSource</dfn></code></a> and
    <a href="http://heycam.github.io/webidl/#idl-any">
      <code><dfn>any</dfn></code></a>
    are defined in [[!WEBIDL]].
  </p>
  <p>
    <!--a href="http://www.w3.org/TR/dom/#eventinit">
      <dfn>EventInit</dfn></a>,-->
    <a href="http://www.w3.org/TR/dom/#domexception">
      <dfn>DOMException</dfn></a>,
    <a href="http://www.w3.org/TR/dom/#aborterror">
      <dfn>AbortError</dfn></a>,
    <a href="http://www.w3.org/TR/dom/#syntaxerror">
      <dfn>SyntaxError</dfn></a>,
    <a href="http://www.w3.org/TR/dom/#notsupportederror">
      <dfn>NotSupportedError</dfn></a>,
    <a href="http://www.w3.org/TR/dom/#notfounderror">
      <dfn>NotFoundError</dfn></a>,
    <a href="http://www.w3.org/TR/dom/#networkerror">
      <dfn>NetworkError</dfn></a>,
    <a href="http://www.w3.org/TR/dom/#nomodificationallowederror">
    <dfn>NoModificationAllowedError</dfn>,
    <a href="http://www.w3.org/TR/dom/#securityerror">
      <dfn>SecurityError</dfn></a>
    are defined in [[!DOM4]].
  </p>
  <p>
    <a href="http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects">
    <dfn>Promise</dfn></a>,
    <a href="http://www.ecma-international.org/ecma-262/6.0/#sec-json-object">
    <dfn>JSON</dfn></a>,
    <a href="http://www.ecma-international.org/ecma-262/6.0/#sec-json.stringify">
    <dfn>JSON.stringify</dfn></a> and
    <a href="http://www.ecma-international.org/ecma-262/6.0/#sec-json.parse">
    <dfn>JSON.parse</dfn></a>
    are defined in [[!ECMASCRIPT]].
  </p>
  <p>
    The algorithms <a href="http://www.w3.org/TR/encoding/#utf-8-encode">
    <dfn>utf-8 encode</dfn></a>, and
    <a href="http://www.w3.org/TR/encoding/#utf-8-decode">
    <dfn>utf-8 decode</dfn></a> are defined in [[!ENCODING]].
  </p>
  <p>
    <dfn>IANA media type</dfn>s (formerly known as MIME types) are defined in
    <a href="http://tools.ietf.org/html/rfc2046">RFC2046</a>.
  </p>

  <section> <h3>Security related terms</h3>
  <p>
    The term <dfn>expressed permission</dfn> refers to an act by the user, e.g.
    via user interface or setting or host device platform features, using which
    the user approves the permission of a <a>browsing context</a> to access the
    given functionality.
  </p>
  <p>
    The term <dfn id="askforgiveness">ask for forgiveness</dfn> refers to some
    form of unobtrusive notification that informs the user of an operation
    while it is running.
    UAs SHOULD provide the user with means to ignore similar future
    operations from the same <a>origin</a> and advertise this to the user.
  </p>
  <p>
    The term <dfn>prearranged trust relationship</dfn> means that the
    UA has already established a trust relationship for a
    certain operation using a platform specific mechanism, so that an
    <a>expressed permission</a> from the user is not any more needed.
    See also this
    <a href="http://w3c.github.io/web-nfc/security-privacy.html#prearranged-trust-relationship">
    section</a> in the Security and Privacy document.
  </p>
  <p>
    The term <dfn>obtain permission</dfn> for a certain operation indicates
    that the UA has either obtained <a>expressed permission</a>, or
    <a href="#askforgiveness">asks for forgiveness</a>, or ensured a
    <a>prearranged trust relationship</a> exists.
  </p>
  <p>
    The
    <a href="https://w3c.github.io/permissions/#idl-def-PermissionDescriptor">
    <dfn>Web NFC permission name</dfn></a> is
    <a href="https://github.com/w3c/permissions/issues/47">defined</a> as
    <code>"nfc"</code>.
  </p>
  </section>
  <section> <h3>NFC specific terms</h3>
  <p>
    <b>NFC</b> stands for Near Field Communications, short-range wireless
    technology operating at 13.56 MHz which enables communication between
    devices at a distance less than 10 cm. The NFC communications protocols and
    data exchange formats, and are based on existing radio-frequency
    identification (RFID) standards, including ISO/IEC 14443 and FeliCa.
    The NFC standards include ISO/IEC 18092[5] and those defined by the NFC
    Forum. See https://www.nfc-forum.org/specs/spec_list/ for a complete
    listing.
  </p>
  <p>
    An <dfn>NFC adapter</dfn> is the software entity in the underlying
    platform which provides access to NFC functionality implemented in a
    given hardware element (NFC chip). A device may have multiple NFC
    adapters, for instance a built-in one, and one or more attached via USB.
  </p>
  <p>
    An <dfn>NFC tag</dfn> is a passive NFC device.
    The <a>NFC tag</a> is powered by magnetic induction when an active NFC
    device is in proximity range. An <a>NFC tag</a> contains a single
    <a>NDEF message</a>.
    <p class="note">
      The way of reading the message may happen through proprietary
      technologies, which require the reader and the tag to be of the same
      manufacturer. Implementations are expected to encapsulate this.
    </p>
  </p>
  <p>
    An <dfn>NFC peer</dfn> is an active, powered device, which can interact
    with other devices in order to exchange data using NFC.
  </p>
  <p>
    An <dfn>NFC device</dfn> is either an <a>NFC peer</a>, or an <a>NFC tag</a>.
  </p>
  <p>
    An <dfn>NDEF message</dfn> encapsulates one or more application-defined
    <a>NDEF record</a>s. <dfn>NDEF</dfn> is an abbreviation for NFC Forum
    Data Exchange Format, a lightweight binary message format. NDEF messages
    can be stored on an <a>NFC tag</a> or exchanged between NFC-enabled devices.
  </p>
  <p>
    The term <dfn>NFC content</dfn> is a synonym for <a>NDEF message</a>,
    which can originate either from an <a>NFC tag</a> or an <a>NFC peer</a>.
  </p>
  <p>
    An <dfn>NDEF record</dfn> is a part of an <a>NDEF message</a> that has a
    single associated type information to its payload. It contains a
    Type Name Format (TNF) field, the payload size, the payload type, an
    optional identifier which is a URL, and a payload of maximum size of
    2^32-1 bytes.
    The NFC Forum has standardized a small set of useful data types for
    use in <a>NDEF record</a>s, for instance text, URL, and binary data such as
    media. In addition, there are record types designed for more complex
    interactions, such as Smart Poster, and handover records.
  </p>
  <p>
    The <dfn>TNF</dfn> (Type Name Format) field of the <a>NDEF record</a> can
    take binary values denoting the following <a>NDEF record</a> payload
    types:
    <table class="simple">
      <tr>
        <th><strong>TNF value</strong></th>
        <th><strong>NDEF record type</strong></th>
      </tr>
      <tr>
        <td>0</td>
        <td><dfn>Empty</dfn></td>
      </tr>
      <tr>
        <td>1</td>
        <td>NFC Forum <dfn>Well-Known Type</dfn>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td><dfn>Media Type</dfn></td>
      </tr>
      <tr>
        <td>3</td>
        <td><dfn>Absolute URI</dfn></td>
      </tr>
      <tr>
        <td>4</td>
        <td>NFC Forum <dfn>External Type</dfn></td>
      </tr>
      <tr>
        <td>5</td>
        <td><dfn>Unknown</dfn></td>
      </tr>
      <tr>
        <td>6</td>
        <td><dfn>Unchanged</dfn></td>
      </tr>
      <tr>
        <td>7</td>
        <td><dfn>Reserved</dfn></td>
      </tr>
    </table>
    <br>
    NFC Forum <a>Well-Known Type</a> includes record types <i>text</i>,
    <i>URI</i>, <i>Smart Poster</i> (containing an URL or other
    data, and possible actions).
  </p>
  <p>
    An <strong><a>NFC watch</a></strong> is a mechanism used to watch for
    available <a>Web NFC message</a>s fulfilling certain criteria.
    It is defined in more detail in <a href="#dfn-nfc-watch">The watch()
    method</a> section.
  </p>
  <p>
    A <dfn>Web NFC message</dfn> consists of a set of <a>NDEF record</a>s,
    one of which is a <a>Web NFC record</a>.
  </p>
  <p>
    The <dfn>Web NFC message origin</dfn> is an <a>ASCII serialized origin</a>
    with <code>"https"</code> scheme, stored in the <a>Web NFC record</a>.
    For <a>NFC content</a> that is not a <a>Web NFC message</a>, it is
    <code>null</code>.
  </p>
  <p>
    The <dfn id="web-nfc-id">Web NFC Id</dfn> is a <a>URL</a> according to
    [[RFC3986]], specifically the <a>Web NFC message origin</a> optionally
    followed by a <a>URL path</a>, stored in the <a>Web NFC Record</a>.
    This enables matching <a>Web NFC content</a> with <a>URL pattern</a>s
    specified by <a>NFC watch</a>es.
  </p>
  <p>
    A <dfn>Web NFC record</dfn> is an <a>NDEF record</a> of External Type,
    specific to Web NFC. It indicates that the containing <a>NDEF message</a>
    is targeted for <a>browsing context</a>s using this API
    and contains information useful for handling the <a>NDEF message</a> with
    the algorithms defined in this specification.
    The format of a <a>Web NFC record</a> is as follows:
    <ul>
      <li>
        Uses NFC Forum External Type record (<a>TNF</a>=4) with the External
        Type field set to <code>urn:nfc:ext:w3.org:webnfc</code>.
      </li>
      <li>
        The payload contains the <a>Web NFC Id</a> of the
        <a>Web NFC message</a>.
      </li>
    </ul>
  </p>
  <p>
    The term <dfn>Web NFC content</dfn> denotes all <a>Web NFC message</a>s
    contained within an <a>NDEF message</a>, identified by the <a>Web NFC Id</a>
    within the <a>NDEF message</a>. This version of the specification
    supports one <a>Web NFC message</a> per <a>NDEF message</a>.
  </p>
  <p class="note">
    As part of the <a>NDEF record</a>, an <dfn>NDEF Id</dfn> field may be
    present for application specific usages. According to the
    [[!NFC-STANDARDS]] it contains a URL with the maximum length of 256 octets.
    This URL is used for identifying the <a>NDEF record</a> payload in an
    application specific way.
    This version of the specification does not use <a>NDEF Id</a> for
    <a>NDEF record</a> level payload identification, since <a>NDEF message</a>
    level identification is used.
  </p>
  <p>
    An <dfn>NFC handover</dfn> defines NFC Forum Well Known Types and the
    corresponding message structure that allows negotiation and activation of
    an alternative communication carrier, such as Bluetooth or WiFi.
    The negotiated communication carrier would then be used (separately) to
    perform certain activities between the two devices, such as sending photos
    to the other device, printing to a Bluetooth printer or streaming video to
    a television set.
  </p>
  </section>
</section> <!-- Terminology -->

<!-- - - - - - - - - - - - - - -  Introduction  - - - - - - - - - - - - - - -->
<section class="informative"> <h2>Introduction</h2>
  <p>
    In general, there are following groups of user scenarios for NFC:
    <ul>
      <li>
        Hold a device in close proximity to a passively powered tag, such as
        a plastic card or sticker, in order to read and/or write data.
      </li>
      <li>
        Hold two active devices, e.g. phones or tablets, in close proximity
        in order to push a <a>Web NFC message</a> from one device to the other.
      </li>
      <li>
        Hold two active devices, e.g. phones or tablets, in close proximity
        in order to initiate a connection using another wireless carrier such
        as Bluetooth or WiFi.
      </li>
      <li>Card emulation
       <ol>
        <li>
          With a secure element: for payments by holding your phone close to a
          point-of-sales terminal, instead of swiping a payment card.
        </li>
        <li>With host card emulation: for allowing use-cases like using a phone
          acting as a hotel room keycard.
        </li>
       </ol>
      </li>
    </ul>
  </p>
  <p>
    NFC works using magnetic induction, meaning that the reader will emit a
    small electric charge which then creates a magnetic field. This field powers
    the passive device which turns it into electrical impulses to communicate
    data. Thus, when the devices are within range, a read is always performed
    (see NFC Analog Specification and NFC Digital Protocol, NFC Forum, 2006).
    The peer-to-peer connection works in a similar way, as the device
    periodically switches into a so-called initiator mode in order to scan for
    targets, then later to fall back into target mode. If a target is found, the
    data is read the same way as for tags.
  </p>
  <p>
    As NFC is based on existing RFID standards, many NFC chipsets support
    reading RFIDs tags, but many of these are only supported by single
    vendors and not part of the NFC standards. Though certain devices support
    reading and writing to these, it is not a goal of this document to
    support proprietary tags or support interoperability with legacy systems.
  </p>
  <p>
    The NFC Forum has mandated the support of four different tag types to be
    operable with NFC devices. The same is required on operating systems such as
    Android.
    <ol>
      <li>
        <b>NFC Forum Type 1</b>: This tag is based on the ISO/IEC 14443-3A
        (also known as NFC-A, as defined in ISO/IEC 14443-3:2011, Part 3:
        Initialization and anticollision). The tags are rewritable and can be
        configured to become read-only. Memory size can be between 96 bytes and
        2 Kbytes. Communication speed is 106 kbit/sec.
      </li>
      <li><b>NFC Forum Type 2</b>: This tag is also based on the
        ISO/IEC 14443-3A (NFC-A). The tags are rewritable and can be configured
        to become read-only. Memory size can be between 48 bytes and 2 Kbytes.
        Communication speed is 106 kbit/sec. In contrast to Type 1, Type 2 has
        anti-collision protection for dealing with multiple tags within the NFC
        field.
      </li>
      <li><b>NFC Forum Type 3</b>: This tag is based on the Japanese Industrial
        Standard (JIS) X 6319-4, commonly known as FeliCa. The tags are
        preconfigured to be either rewritable or read-only. Memory availability
        is variable, theoretical memory limit is 1MByte per service.
        Communication speed is 106 kbit/sec. Like Type 2, it supports
        anti-collision protection.
      </li>
      <li><b>NFC Forum Type 4</b> (November 2010): This tag is based on the
        ISO/IEC 14443 like Type 1 and 2, but it supports either NFC-A or NFC-B
        for communication. On top of that the tag may support the Data Exchange
        Protocol (aka ISO-DEP) defined in ISO/IEC 14443 (ISO/IEC 14443-4:2008
        Part 4: Transmission protocol). Like Type 3, the tags are preconfigured
        to be either rewritable or read-only. Variable memory, up to 32 KB per
        service. Supports three different communication speeds 106 or 212 or
        424 Kbits/s.
      </li>
    </ol>
  </p>
  <p>
    In addition to data types standardized for <a>NDEF record</a>s by the NFC
    Forum, many commercial products such as bus cards, door openers etc use
    different card specific data and protocol extensions which require specific
    NFC chips (same vendor of card and reader) in order to function.
  </p>
  <p>
    Card emulation mode capabilities also depend on the NFC chip in the device.
    For payments, a Secure Element is often needed.
  </p>
  <p class="note">
    This document does not aim supporting all possible use cases of NFC
    technology, but only a few use cases which are considered relevant to be
    used by web pages in browsers, using the browser security model.
  </p>
  </section> <!-- Introduction -->

  <!-- - - - - - - - - - - - - - Usage Examples - - - - - - - - - - - - - - -->
  <section class="informative"> <h2>Examples</h2>
  <p>
    This section shows how developers can make use of the various features of
    this specification.
  </p>

  <aside title="Push a text string to either a tag or peer"
       class="example">
    <p>
      Pushing a text string (like the serialized JSON below)
      to any kind of device is straight forward. Options can
      be left out, as they default to pushing to both tags and
      peers.
    </p>
    <pre class="highlight">
navigator.nfc.push(
  '{ "prop1": "value1", "prop2": "value2" }'
).then(() => {
  console.log("Message pushed.");
}).catch((error) => {
  console.log("Push failed :-( try again.");
});
    </pre>
  </aside>

  <aside title="Push a text string to a peer device" class="example">
    <p>
      It is possible to restrict to which devices (tags or peers) data
      should be pushed. Below we specify to only push to peers,
      and thus, no data is pushed when the user taps a tag.
    </p>
    <pre class="highlight">
navigator.nfc.push(
  "Text meant for peers only", { target: "peer" }
).then(() => {
  console.log("Message pushed.");
}).catch((error) => {
  console.log("Push failed :-( try again.");
});
    </pre>
  </aside>

  <aside title="Push a URL to either a tag or peer" class="example">
    <p>
      In order to push an NDEF record of URL type, simply use NFCMessage.
    </p>
    <pre class="highlight">
navigator.nfc.push({
  data: [{ recordType: "url", data: "https://w3c.github.io/web-nfc/" }]
}).then(() => {
  console.log("Message pushed.");
}).catch((error) => {
  console.log("Push failed :-( try again.");
});
    </pre>
  </aside>

  <aside title="Read data from tag, and write to empty ones" class="example">
    <p>
      Below we read various different kinds of data which can be stored on a tag.
      In the case the tag is empty, we write a text message with the value
      "Hello World".
    </p>
    <pre class="highlight">
navigator.nfc.watch((message) => {
  if (message.data[0].recordType == 'empty') {
    navigator.nfc.push({
      url: "/custom/path",
      data: [{ recordType: "text", data: 'Hello World' }]
    });
  } else {
    console.log('Read message written by ' + message.url);
    processMessage(message);
  }
}).then(() => {
  console.log("Added a watch.");
}).catch((error) => {
  console.log("Adding watch failed: " + error.name);
});

function processMessage(message) {
  for (let record of message.data) {
    switch (record.recordType) {
      case "text":
        console.log('Data is text: ' + record.data);
        break;
      case "url":
        console.log('Data is URL: ' + record.data);
        break;
      case "json":
        console.log('JSON data: ' + record.data.myProperty.toString());
        break;
      case "opaque":
        if (record.mediaType == 'image/png') {
          var img = document.createElement("img");
          img.src = URL.createObjectURL(new Blob(record.data, record.mediaType));
          img.onload = function() {
            window.URL.revokeObjectURL(this.src);
          };
        }
        break;
    }
  }
}
    </pre>
  </aside>

  <aside title="Save and restore game progress with another device"
       class="example">
    <p>
      Filtering of relevant data sources can be done by the use of
      the <a>NFCWatchOptions</a>. Below we accept any URL with <code>
      "/mypath/mygame/"</code> in its path. When we read the data,
      we immediately update the game progress by issueing a push
      with a custom NDEF data layout.
    </p>
    <p>
      The example allows reading and pushing to both peers and tags,
      whichever one is tapped first.
    </p>
    <pre class="highlight">
navigator.nfc.watch(reader, { url: "* /mypath/mygame/*" });

function reader(message) {
  console.log("Source:     " + message.url);
  console.log("Game state: " + message.data);

  var message = {
    url: "/mypath/mygame/update",
    data: [{
      recordType: "json",
      mediaType: "application/json",
      data: { level: 3, points: 4500, lives: 3 }
    }]
  };

  navigator.nfc.push(message).then(() => {
    console.log('Progress stored!');
  }).catch((error) => {
    console.log('Failure, please try again.');
  });
}
    </pre>
  </aside>

  <aside title="Push and read JSON (serialized and deserialized)"
       class="example">
    <p>
      Storing and receiving JSON data is easy with serialization and deserialization.
    </p>
    <pre class="highlight">
navigator.nfc.watch((message) => {
  for (let record of message.data) {
    let article =/[aeio]/.test(record.data.title) ? "an" : "a";
    console.log(`$(record.data.name) is $(article) $(record.data.title)`);
  }
}, { url: document.baseURI, recordType: = "json" });

navigator.nfc.push({
  data: [
    {
      recordType: "json",
      mediaType: "application/json",
      data: {
        name: "Benny Jensen",
        title: "Banker"
      }
    },
    {
      recordType: "json",
      mediaType: "application/json",
      data: {
        name: "Zoey Braun",
        title: "Engineer"
      }
    }]
});
    </pre>
  </aside>

  <aside title="Write data to tag and print out existing data" class="example">
    <p>
      Pushing data to a tag requires tapping it. If existing data should be
      read during the same tap, we need to set the <code>ignoreRead</code>
      property to <code>false</code> and set up a watch before the push.
    </p>
    <pre class="highlight">
navigator.nfc.watch((message) => {
  for (let record of message.data) {
    console.log("Record type:  " + record.recordType);
    console.log("MIME type:    " + record.mediaType);
    console.log("=== data ===\n" + record.data);
  }
});

navigator.nfc.push("Pushing data is fun!", { target: "tag", ignoreRead: false });
    </pre>
  </aside>

  <aside title="Write Chinese text as UTF-8" class="example">
    <p>
      In order to write a non-UTF-16 string, the data mush be written
      as an <a>ArrayBuffer</a> and the charset must be set as part
      of the <a>IANA media type</a>.
    </p>
    <pre class="highlight">
let encoder = new TextEncoder([utfLabel = "utf-8"]);
let utf8Text = encoder.encode("电脑坏了。");

navigator.nfc.push({ data: [
  {
    recordType: "text",
    mediaType: "text/plain; lang=zh; charset=UTF-8;",
    data: utf8Text.buffer
  }
]});
    </pre>
  </aside>

  </section> <!-- Usage examples -->

  <section class="informative"> <h3>Use Cases</h3>
    <p>
      A few Web NFC user scenarios are described in the
      <a href="https://w3c.github.io/web-nfc/use-cases.html">Use Cases</a>
      document. These user scenarios can be grouped by criteria based on
      security, privacy and feature categories, resulting in generic flows as
      follows.
    </p>
    <section> <h3>Reading an <a>NFC tag</a></h3>
      <ol>
        <li>
          Reading an <a>NFC tag</a> containing a <a>Web NFC message</a>, when a
          web page using the Web NFC API is open and in focus.
          For instance, a web page instructs the user to tap an NFC tag, and
          then receives information from the tag.
        </li>
        <li>
          Reading an <a>NFC tag</a> containing other than <a>Web NFC message</a>,
          when a web page using the Web NFC API is open and in focus.
        </li>
        <li>
          Reading an <a>NFC tag</a> when no web site using the Web NFC API is
          open or in focus.
          This use case is not supported in this version of the specification,
          and is has low priority for future versions as well.
        </li>
      </ol>
    </section>
    <section> <h3>Writing to an <a>NFC tag</a></h3>
      <p>
        The user opens a web page which can write an <a>NFC tag</a>. The write
        operations may be one of the following:
        <ol>
          <li>
            Writing to an empty <a>NFC tag</a>.
          </li>
          <li>
            Writing to an <a>NFC tag</a> which already contains a
            <a>Web NFC message</a> with a different <a>Web NFC message origin</a>
            (i.e. overwriting a web-specific tag).
          </li>
          <li>
            Writing to an <a>NFC tag</a> which already contains a
            <a>Web NFC message</a> with the same <a>Web NFC message origin</a>
            (i.e. updating own tag).
          </li>
          <li>
            Writing to other, writable <a>NFC tag</a>s (i.e. overwriting a
            generic tag).
          </li>
        </ol>
      </p>
      <p class-"note">
        Note that an NFC write operation to an <a>NFC tag</a> always involves
        also a read operation.
      </p>
    </section>
    <section> <h3>Pushing data to an <a>NFC peer</a> device</h3>
      <p>
        In general, pushing data to another Web NFC capable device requires that
        on the initiating device the user would first have to navigate to a web
        site. The user would then touch the device against another Web NFC
        equipped device, and data transfer would occur. On the receiving device
        the UA will dispatch the content to an application registered
        and eligible to handle the content, and if that application is a browser
        which has a web page open and in focus that uses the Web NFC API and has
        set up a <a>NFC watch</a> to listen to <a>Web NFC content</a>, then the
        content is delivered to the web page through the parameters of an
        <code>NFCMessageCallback</code>.
      </p>
    </section>
    <section> <h3>Handover to another wireless connection type</h3>
      <p>
        NFC supports handover protocols to Bluetooth or WiFi connectivity for
        the purpose of larger volume data transfer. The user touches another
        NFC capable device, and as a result configuration data is sent for a
        new Bluetooth or WiFi connection, which is then established between the
        devices.
        This use case is not supported in this version of the specification.
      </p>
    </section>
    <section> <h3>Payment scenarios</h3>
      <p>
        The user buys goods in a store, and payments options include NFC.
        In general, touching the device to the point of sales terminal receiver
        area will result in a transaction between the secure element from the
        device and the point of sales terminal. With the Web NFC API, if the
        user navigates to a web site before paying, there may be interaction
        with that site regarding the payment, e.g. the user could get points and
        discounts, or get delivered application or service specific data (e.g.
        tickets, keys, etc) to the device.
        This use case is not supported in this version of the specification.
      </p>
    </section>
    <section> <h3>Support for multiple NFC adapters</h3>
      <p>
        Users may attach one or more external <a>NFC adapter</a>s to their
        devices, in addition to a built-in adapter. Users may use either
        <a>NFC adapter</a>.
      </p>
    </section>
  </section> <!-- Use Cases -->

  <section class="informative"> <h3>Features</h3>
    <p>High level features for the Web NFC specification include the following:
      <ol>
        <li>
          Support devices with single or multiple <a>NFC adapter</a>s.
          If there are multiple adapters present when invoking an NFC function
          then the UA operates all <a>NFC adapter</a>s in parallel.
        </li>
        <li>
          Support communication with active (powered devices such as readers,
          phones) and passive (smart cards, tags, etc) devices.
        </li>
        <li>
          Allow users to act on (e.g. read, write or transceive) discovered
          NFC devices (passive and active), as well as access the payload
          which were read in the process as <a>Web NFC message</a>s.
        </li>
        <li>
          Allow users to write a payload via NDEF records to compatible
          devices, such as writeable tags, when they come in range, as
          <a>Web NFC message</a>s.
        </li>
        <li>
          [future] Allow manual connection for various technologies such as
          NFC-A and NFC-F depending on the secondary device.
        </li>
        <li>
          [future] Allow <a>NFC handover</a> to Bluetooth or WiFi.
        </li>
        <li>
          [future] Allow card emulation with secure element or host card
          emulation.
        </li>
      </ol>
    </p>
    <p>
      This specification makes a few simplifications in what use cases
      and data types the Web NFC API can handle:
      <ul>
        <li>
          Expose data types already known to web browsers as
          <a>IANA media type</a>s.
        </li>
        <li>Use the web security model.</li>
        <li>
          Implementations encapsulate <a>NDEF record</a> handling and the API
          exposes only data and control events.
        </li>
      </ul>
    </p>
  </section> <!-- Features -->
</section> <!-- Introduction -->

<!-- - - - - - - - - - - - - Security and Privacy - - - - - - - - - - - - - -->
<section> <h2 id="security">Security and Privacy</h2>
  <p>
    The trust model, attacker model, threat model and possible mitigation
    proposals for the Web NFC API are presented in the
    <a href="http://w3c.github.io/web-nfc/security-privacy.html">
    Security and Privacy</a> document. This section presents the chosen
    security and privacy model through normative requirements to
    implementations.
  </p>

  <section> <h3>Chain of trust</h3>
  <p>
    Web pages using the Web NFC API are not trusted.
    This means that the user needs to be aware of exactly what a web page is
    intending to do with NFC at any given moment. Implementations need to
    make sure that when the user authorizes a method of this API, then only that
    action is run, without side effects, and exactly in the context and the
    number of times the user allows the execution of NFC related operations,
    according to the algorithmic steps detailed in this specification.
  </p>
  <p>
    The integrity of <a>NFC content</a> SHOULD NOT be trusted when
    used for implementing security policies, for instance the authenticity of
    <a>origin</a>s saved in the <a>Web NFC Id</a>, unless a
    <a>prearranged trust relationship</a> exists.
  </p>
  </section>

  <section> <h3>Threats</h3>
  <p>
    The main threats are summarized in the
    <a href="http://w3c.github.io/web-nfc/security-privacy.html#threats-and-possible-solutions">
    Security and Privacy</a> document.
  </p>
  <p>
    In this specification the following threats are handled with the highest
    priority:
    <ul>
      <li>
        User data privacy: involuntary sharing of user data (such as location,
        contacts, personal data, etc) from an NFC-capable device such as a
        phone, tablet, or PC.
      </li>
      <li>
        Protecting existing <a>NFC tag</a>s from being overwritten by malicious
        web pages.
      </li>
    </ul>
  </p>
  </section>

  <section> <h3>Permissions and user prompts</h3>
  <p>
    This specification attempts to minimize user prompting and uses implicit
    security policies to address the
    <a href="http://w3c.github.io/web-nfc/security-privacy.html#threats-and-possible-solutions">
    threats</a>.
    However, this specification does not describe, nor does it
    mandate specific user prompting policies. The term <a>obtain permission</a>
    is used for acquiring trust for a given operation.
  </p>
  <p class="note">
    The <a href="http://www.w3.org/TR/permissions/">Permissions API</a> is
    suggested to be used by UAs for implementing NFC related
    [[permissions]] in order to minimize the need for user prompting.
  </p>
  <p>
    All <a>expressed permission</a>s that are preserved beyond the current
    browsing session MUST be revocable.
  </p>
  </section>

  <section class="informative"> <h3>Security policies</h3>
    <p>
      This section summarizes the security policies which are specified as
      normative requirements in the respective algorithms of this
      specification:
    </p>
    <ul>
      <li>
        Only <a>script execution environment</a>s of
        <code><a>Document</a></code>s with a <a>browsing context</a>, and an
        <a>incumbent settings object</a> which is a <a>secure context</a> are
        allowed to access <a>NFC content</a>.
        Browsers may ignore this rule for development purposes only.
      </li>
      <li>
        In order to use NFC, the <code><a>Window</a></code> object associated
        with the <code><a>Document</a></code> contained by the
        <a href="http://www.w3.org/TR/html5/browsers.html#top-level-browsing-context">
        top level browsing context</a> using
        the Web NFC API must be
        <a href="http://www.w3.org/TR/page-visibility/#now-visible-algorithm">
        visible</a> and in
        <a href="https://html.spec.whatwg.org/#focus">focus</a>.
        This also means that UAs should block access to the NFC radio if
        the display is off or the device is locked.
        For backgrounded web pages, receiving and pushing <a>NFC content</a>
        must be <a id="#nfc-suspended">suspended</a>.
      </li>
      <li>
        When pushing <a>Web NFC content</a>, the
        <a>ASCII serialized origin</a> and the <a>URL path</a> of
        the <a>incumbent settings object</a> of the
        <a>script execution environment</a> requesting the operation must be
        recorded in each sent <a>NDEF message</a>'s <a>Web NFC record</a>.
        For details see the <a>Writing or pushing content</a> section.
      </li>
      <li>
        When setting up <a>NFC watch</a>es, when pushing <a>NFC content</a>,
        the UA may warn the user that the given <a>origin</a> may be able to
        infer physical location.
      </li>
      <li>
        Pushing <a>Web NFC content</a> to an <a>NFC tag</a> does not need to
        <a>obtain permission</a>, if the <a>Web NFC message origin</a> of the
        <a>Web NFC message</a> on that <a>NFC tag</a> is equal to the
        <a>ASCII serialized origin</a> of the <a>incumbent settings object</a>.
        Otherwise the UA must <a>obtain permission</a> for pushing
        <a>NFC content</a> which overwrites existing information.
        See also the <a>Writing or pushing content</a> section.
      </li>
      <li>
        Pushing <a>NFC content</a> to an <a>NFC peer</a> does not need to
        <a>obtain permission</a>, but the previous rules apply.
        See the <a>Writing or pushing content</a> section.
      </li>
      <li>
        Making an <a>NFC tag</a> read-only must <a>obtain permission</a>, or
        otherwise fail.
      </li>
      <li>
        Setting up listeners for reading <a>NFC content</a> should
        <a>obtain permission</a>.
      </li>
      <li>
        The process of reading an <a>NDEF message</a> does not need to
        <a>obtain permission</a>.
      </li>
      <li>
        The payload data on NFC content is untrusted, and must not be used
        by the UA to do automatic handling such as opening a web page
        with a URL found in an NFC tag, unless the user approves that.
      </li>
      <li>
        Since all local content that a web page has access to can be shared with
        NFC, the user needs to be clearly aware about the permissions granted
        to the web page using the Web NFC API.
      </li>
      <!--li>
        For Bluetooth and WiFi handover (supported in later versions),
        the user should have to grant access to the secondary API and must be
        able to properly understand what they are granting.
      </li-->
    </ul>
  </section> <!-- Policies -->
</section> <!-- Security and Privacy  -->

<!-- - - - - - - - - - - - - Data representation - - - - - - - - - - - - - -->
<section> <h2>Data Representation</h2>
  <section> <h3>The <strong>NFCRecord</strong> dictionary</h3>
    <p>
      The content of any <a>NDEF record</a> is exposed by the
      <dfn>NFCRecord</dfn> dictionary:
    </p>
    <pre class="idl">
      enum NFCRecordType {
        "empty",
        "text",
        "url",
        "json",
        "opaque"
      };

      typedef (DOMString or unrestricted double or ArrayBuffer or Dictionary) NFCRecordData;

      dictionary NFCRecord {
        NFCRecordType recordType;
        USVString mediaType;
        NFCRecordData data;
      };
    </pre>
    <p>
      The <dfn>NFCRecord.mediaType</dfn>
      property represents the <a>IANA media type</a> of the <a>NDEF record</a>
      payload.
    </p>
    <p>
      The <dfn>NFCRecord.data</dfn> property represents the
      payload data of the <a>NDEF record</a> with an appropriate ECMAScript
      type, which depends on the <a>IANA media type</a>.
    </p>
    <p>
      The <dfn>NFCRecord.recordType</dfn> property represents the
      <a>NDEF record</a> types.
      The mapping from data types of an <code><a>NFCRecord</a></code> to and
      from <a>NDEF record</a> types is presented in the algorithmic steps which
      handle the data and described in the
    <a href="#steps-receiving">Receiving and parsing content</a>
    and <a>Writing or pushing content</a> sections.
    </p>
  </section> <!-- NFCRecord dictionary -->

  <section> <h3>The <strong>NFCMessage</strong> dictionary</h3>
    <p>
      The content of any <a>Web NFC message</a> is exposed by the
      <dfn>NFCMessage</dfn> dictionary:
    </p>
    <pre class="idl">
      dictionary NFCMessage {
        sequence&lt;NFCRecord&gt; data;
        USVString url;
      };
    </pre>
    <p>
      The <dfn>NFCMessage.url</dfn>
      property represents the <a>Web NFC Id</a> of a received
      <a>Web NFC message</a>. When used in the <code><a>NFC.push</a>()</code>
      method, it represents a <a>URL path</a> used for constructing the
      <a>Web NFC Id</a> of the pushed <a>Web NFC content</a>.
    </p>
    <p>
      The <dfn>NFCMessage.data</dfn>
      property represents the <a>NDEF message</a> defining the
      <a>Web NFC message</a>.
    </p>
  </section>

  <section><h3>Data mapping</h3>
  <p>
    A <dfn>JSON compatible <a>IANA media type</a></dfn> is defined by the
    following ABNF:
    <pre>
      <code>"application/"</code> (<code>"json"</code> / &lt;VCHAR except '/' and "*"&gt; <code>"+json"</code>)
    </pre>
  </p>
  <p>
    The mapping from data types of an <code><a>NFCRecord</a></code> to
    <a>NDEF record</a> types, as used in the <a>Writing or pushing content</a>
    section is as follows:
  </p>
  <table class="simple">
    <tr>
      <th>NFCRecord recordType</th>
      <th>NFCRecord mediaType</th>
      <th>NFCRecord data</th>
      <th>NDEF record type</th>
    </tr>
    <tr>
      <td>"empty"</td>
      <td><i>not used</i></td>
      <td><i>not used</i></td>
      <td>NFC Forum Empty Type (<a>TNF</a>=0)</td>
    </tr>
    <tr>
      <td>"text"</td>
      <td><i>not used</i></td>
      <td><code>DOMString</code></td>
      <td>NFC Forum Well Known Type (<a>TNF</a>=1) with type <i>Text</i></td>
    </tr>
    <tr>
      <td>"url"</td>
      <td><i>not used</i></td>
      <td><code>DOMString</code></td>
      <td>NFC Forum Well Known Type (<a>TNF</a>=1) with type <i>URI</i></td>
    </tr>
    <tr>
      <td>"json"</td>
      <td><a>JSON compatible IANA media type</a></td>
      <td>
        <code>null</code> or <code>DOMString</code> or <code>Number</code> or
        <code>Dictionary</code>
      </td>
      <td>Media Type as defined in [[RFC2046]] (<a>TNF</a>=2) with
        <a>IANA media type</a> specified in the <code>type</code> attribute.
      </td>
    </tr>
    <tr>
      <td>"opaque"</td>
      <td><a>IANA media type</a></td>
      <td><code>ArrayBuffer</code></td>
      <td>Media Type as defined in [[RFC2046]] (<a>TNF</a>=2)</td>
    </tr>
    <tr>
      <td>"opaque"</td>
      <td><code>""</code> (<i>empty</i>)</td>
      <td><code>ArrayBuffer</code> or typed array</td>
      <td>NFC Forum External Type (<a>TNF</a>=4)</td>
    </tr>
  </table>
  <p>
    The mapping from <a>NDEF record</a> types to <code><a>NFCRecord</a></code>,
    as used for incoming <a>NDEF message</a>s described in the
    <a href="#steps-receiving">Receiving and parsing content</a> section, is as
    follows:
  </p>
  <table class="simple">
    <tr>
      <th>NDEF record type</th>
      <th>NFCRecord recordType</th>
      <th>NFCRecord mediaType</th>
      <th>NFCRecord data</th>
    </tr>
    <tr>
      <td>NFC Forum Empty Type (<a>TNF</a>=0)</td>
      <td>"empty"</td>
      <td>""</td>
      <td><code>null</code></td>
    </tr>
    <tr>
      <td>NFC Forum Well Known Type (<a>TNF</a>=1) with type <i>Text</i></td>
      <td>"text"</td>
      <td>"text/plain"</td>
      <td><code>DOMString</code></td>
    </tr>
    <tr>
      <td>NFC Forum Well Known Type (<a>TNF</a>=1) with type <i>URI</i></td>
      <td>"url"</td>
      <td>"text/plain"</td>
      <td><code>DOMString</code></td>
    </tr>
    <tr>
      <td>NFC Forum Well Known Type (<a>TNF</a>=1) with type
          <i>Smart Poster</i></td>
      <td>"url"</td>
      <td>"text/plain"</td>
      <td><code>DOMString</code></td>
    </tr>
    <tr>
      <td>Absolute URI as defined in [[RFC3986]] (<a>TNF</a>=3)</td>
      <td>"url"</td>
      <td>"text/plain"</td>
      <td><code>DOMString</code></td>
    </tr>
    <tr>
      <td>Media Type as defined in [[RFC2046]] (<a>TNF</a>=2) with
        <a>JSON compatible IANA media type</a>
      </td>
      <td>"json"</td>
      <td>The <a>IANA media type</a> used in the NDEF record</td>
      <td>
        <code>null</code> or <code>DOMString</code> or <code>Number</code> or
        <code>Dictionary</code>
      </td>
    </tr>
    <tr>
      <td>Media Type as defined in [[RFC2046]] (<a>TNF</a>=2)</td>
      <td>"opaque"</td>
      <td>The <a>IANA media type</a> used in the NDEF record</td>
      <td><code>ArrayBuffer</code></td>
    </tr>
    <tr>
      <td>NFC Forum External Type (<a>TNF</a>=4) with type other than
        <code>urn:nfc:ext:w3.org:webnfc*</code></td>
      <td>"opaque"</td>
      <td>"application/octet-stream"</td>
      <td><code>ArrayBuffer</code></td>
    </tr>
    <tr>
      <td>Any other <a>NDEF record</a> type</td>
      <td>"opaque"</td>
      <td>"application/octet-stream"</td>
      <td><code>ArrayBuffer</code></td>
    </tr>
  </table>
  <p>
    The <a>Web NFC record</a>s MUST NOT be exposed to client
    <a>browsing context</a>s.
  </p>
  </section>
</section> <!-- Data types and content -->

<!-- - - - - - - - - - - Extended interface Navigator - - - - - - - - - - - -->
<section> <h2>Extensions to the <strong>Navigator</strong> interface</h2>
  <p>
    The HTML document defines a
    <a href="http://www.whatwg.org/specs/web-apps/current-work/#dom-navigator">
    <code>Navigator</code></a> interface [HTML] which this specification
    extends.
  </p>
  <pre class="idl">
    partial interface Navigator {
      readonly attribute NFC nfc;
    };
  </pre>
  <!-- - - - - - - - - - - - nfc attribute  - - - - - - - - - - - -->
  <section> <h3>The <strong>nfc</strong> attribute</h3>
  <p>
    On getting the <a>nfc</a> attribute, the UA MUST return the <a>NFC</a>
    object, which provides NFC related functionality.
  </p>
  </section> <!-- nfc attribute -->
</section> <!-- Navigator -->

<section> <h2>The <strong>NFC</strong> interface</h2>
  The <dfn>NFC</dfn> object provides a way for the <a>browsing context</a> to
  use NFC functionality.
  It allows for pushing <a>Web NFC message</a>s to <a>NFC tag</a>s
  or <a>NFC peer</a>s within range, and to set up and cancel <a>NFC watch</a>es
  to handle incoming <a>Web NFC message</a>s either from an <a>NFC tag</a> or an
  <a>NFC peer</a>.
  <pre class="idl">
    typedef (DOMString or ArrayBuffer or NFCMessage) NFCPushMessage;

    interface NFC {
      Promise&lt;void&gt; push(NFCPushMessage message, optional NFCPushOptions options);
      Promise&lt;void&gt; cancelPush(optional NFCPushTarget target="any");
      Promise&lt;long&gt; watch(MessageCallback callback, optional NFCWatchOptions options);
      Promise&lt;void&gt; cancelWatch(optional long id);
    };

    callback MessageCallback = void (NFCMessage message);
  </pre>
  <p class="note">
    In later versions <code>cancelPush()</code> and <code>cancelWatch()</code>
    may be obsoleted by <a href="https://github.com/domenic/cancelable-promise">
    cancelable Promises</a> used with <code>push()</code> and
    <code>watch()</code>, respectively.
  </p>
  <section><h3>Internal slots of NFC</h3>
  <p>
    The <a>NFC</a> object is created with the <a>internal slots</a>
    described in the following table:
  </p>
  <table class="simple">
    <thead>
     <tr>
      <th>Internal Slot</th>
      <th>Description (<em>non-normative</em>)</th>
     </tr>
    </thead>
    <tbody>
     <tr>
      <td>[[\suspended]]</td>
      <td>
        A boolean flag indicating whether NFC functionality is
        <a href="#nfc-suspended">suspended</a> or not, initially
        <code>false</code>.
      </td>
     </tr>
     <tr>
      <td>[[\watchList]]</td>
      <td>
        A list of <a>NFC watch</a>es initially set to empty list.
      </td>
     </tr>
    </tbody>
  </table>
  </section>

  <section> <h3>Handling NFC adapters</h3>
    Implementations MAY use multiple <a>NFC adapter</a>s
    according to the algorithmic steps described in this specification.

    The <a>NFC</a> object represents all NFC hardware devices that can read and
    write <a>NFC content</a>.
  </section>

  <section><h3>Handling Window visibility and focus</h3>
    <p>
      Each <code><a>Window</a></code> object connected to the
       <a>script execution environment</a> has a separate <code>NFC</code>
       instance. The
      <a href="http://www.w3.org/TR/page-visibility/#now-visible-algorithm">
       visibility</a> and
       <a href="https://html.spec.whatwg.org/#focus">focus</a> state of the
       <code><a>Window</a></code> object determines the
       <a href="#nfc-suspended">suspended</a> state of the associated
       <code>NFC</code> instance.
    </p>
    <p>
      The term <dfn id="nfc-suspended">suspended</dfn> in this specification
      refers to NFC operations being suspended, i.e. no <a>NFC content</a> is
      pushed, and no received <a>NFC content</a> is presented via watches while
      suspended.
      However, platform level timers for the
      <code><a>NFC.push</a>()</code> method continue running,
      and if they expire, the event should be recorded and handled
      when execution next resumes, i.e. when the <code>focus</code>
      event is fired on the <code><a>Window</a></code> object.
    </p>
    <p>
      When the <code><a>Window</a></code> object associated with the
      <code><a>Document</a></code> using the Web NFC API
      <a href="http://www.w3.org/TR/page-visibility/#now-visible-algorithm">
      becomes visible</a> and in
      <a href="https://html.spec.whatwg.org/#focus">focus</a>,
      then run the following steps:
    </p>
    <ol id="steps-visible-focus">
      <li>
        Set <var>NFC@[[\suspended]]</var> to <code>false</code>.
      </li>
    </ol>
    <p>
      When the <code><a>Window</a></code> object associated with the
      <code><a>Document</a></code> using the Web NFC API
      <a href="https://html.spec.whatwg.org/#handler-onblur">loses focus</a>,
      then run the following steps:
    </p>
    <ol id="steps-focus-lost">
      <li>
        Set <var>NFC@[[\suspended]]</var> to <code>true</code>.
      </li>
    </ol>
  </section> <!-- visibility & focus: the suspended state -->

  <section><h3>Releasing NFC</h3>
  <p>
    If a user agent is to
    <a href="https://html.spec.whatwg.org/#make-disappear">make disappear</a>
    an <code><a>NFC</a></code> object <var>nfc</var>, run the following
    <dfn>NFC release steps</dfn>, given <var>nfc</var>:
  </p>
  <ol id="steps-nfc-release">
    <li>
      Set <var>nfc</var>@[[\suspended]] to <code>true</code>.
    </li>
    <li>
      Run the <var>nfc</var>.<a href="#steps-cancelPush">cancelPush()</a>
      steps with <code>"tag"</code> as parameter.
    </li>
    <li>
      Run the <var>nfc</var>.<a href="#steps-cancelPush">cancelPush()</a>
      steps with <code>"peer"</code> as parameter.
    </li>
    <li>
      Stop the <a>dispatch NFC content</a> steps.
    </li>
    <li>
      Clear <var>nfc</var>@[[\watchList]].
    </li>
    <li>
      Release the NFC resources associated with <var>nfc</var> on the
      underlying platform.
    </li>
  </ol>
  <p>
    The UA should run the <a>NFC release steps</a>, given <var>nfc</var>, as
    additional steps to the
    <a href="https://html.spec.whatwg.org/#unloading-document-cleanup-steps">
    unloading document cleanup steps</a>.
  </p>
  </section> <!-- release NFC -->

  <section> <h3>The <strong>NFCPushOptions</strong> dictionary</h3>
    <pre class="idl">
      enum NFCPushTarget {
        "tag",
        "peer",
        "any"
      };

      dictionary NFCPushOptions {
        NFCPushTarget target = "any";
        unrestricted double timeout = Infinity;
        boolean ignoreRead = true;
      };
    </pre>
    <p>
      The <dfn>NFCPushOptions.target</dfn> property
      denotes the intended target for the pending <code>push()</code>
      operation.
    </p>
    <p>
      The <dfn>NFCPushOptions.timeout</dfn> property
      denotes the timeout for the pending <code>push()</code>
      operation expressed in milliseconds. The default value is
      implementation-dependent. The value <code>Infinity</code> means there is
      no timeout, i.e. no timer is started. After the <var>timeout</var>
      expires, the message set for pushing is cleared, an error is returned,
      and a new <a>Web NFC message</a> can be set for pushing.
    </p>
    <p>
      When the value of the <dfn>NFCPushOptions.ignoreRead</dfn> property is
      <code>true</code>, the <a href="#steps-push">push algorithm</a>
      will skip invoking the <a href="steps-receiving">
      receiving and parsing steps</a> for an <a>NFC tag</a>.
    </p>
  </section>

  <section> <h3>The <strong>NFCWatchOptions</strong> dictionary</h3>
      <p>
        To describe which messages an application is interested in, the
        <dfn>NFCWatchOptions</dfn> dictionary is used:
      </p>
      <pre class="idl">
        enum NFCWatchMode {
          "web-nfc-only",
          "any"
        };

        dictionary NFCWatchOptions {
          USVString url = "";
          NFCRecordType? recordType;
          USVString mediaType = "";
          NFCWatchMode mode = "web-nfc-only";
        };
      </pre>
      <p>
        The <dfn>NFCWatchOptions.url</dfn> property
        denotes the <a>URL pattern</a> which is used for matching the
        <a>Web NFC Id</a> of <a>Web NFC message</a>s which are being read.
        The default value <code>""</code> means that no matching happens.
      </p>
      <p>
        The <dfn>NFCWatchOptions.recordType</dfn> property
        denotes the string value which is used for matching the
        <code>
        <a href="#idl-def-nfcrecordtype">type</a></code> property of each
        <code><a>NFCRecord</a></code> object in a <a>Web NFC message</a>.
        The default value <code>""</code> means that no matching happens.
      </p>
      <p>
        The <dfn>NFCWatchOptions.mediaType</dfn> property
        denotes the <a>match pattern</a> which is used for matching the
        <code><a href="#dom-nfcrecord-type">type</a></code> property of each
        <code><a>NFCRecord</a></code> object in a <a>Web NFC message</a>.
        The default value <code>""</code> means that no matching happens.
      </p>
      <p>
        The <dfn>NFCWatchOptions.mode</dfn> property denotes the
        <code><a>NFCWatchMode</a></code> value telling whether only
        <a>Web NFC content</a> or any <a>NFC content</a> will be watched.
        The <code>"web-nfc-only"</code> value means that only those
        <a>NDEF message</a>s are exposed which contain a
        <a>Web NFC record</a>, i.e. which are meant for web pages.
        The <code>"any"</code> value means that all <a>NDEF message</a>s
        are exposed.
      </p>
      <pre
        title="Filter accepting only JSON content from https://www.w3.org"
        class="example highlight">
        var watchOptions = {
          url: "https://www.w3.org/*",  // any path from the domain is accepted
          recordType: "json",
          mediaType: "application/*+json"  // any JSON-based IANA media type
        }
      </pre>
      <pre
        title="Filter which only accept binary content from a given path but any domain"
        class="example highlight">
        var watchOptions = {
          url: "*://* /info/restaurant/daily-menu/",  // accepted from any domain
          recordType: "opaque",
          mediaType: "application/octet-stream"
        }
      </pre>
    </section> <!-- NFCWatchOptions -->

  <section><h3><dfn>Writing or pushing content</dfn></h3>
    <p>
      This section describes how to write an <a>NDEF message</a>
      to an <a>NFC tag</a> or how to push it to an <a>NFC peer</a>
      device when it is next time in proximity range before a timer expires.
      At any time there is at maximum of two
      <a>Web NFC message</a>s that can be set for pushing for an <a>origin</a>:
      one targeted to <a>NFC tag</a>s and one to <a>NFC peer</a>s, until
      the current message is sent, or a timeout happens, or the push is
      canceled by the
      <a href="cancelPush"><code>cancelPush()</code></a> method.
    </p>
    <section><h3>The push() method</h3>
      <p id="steps-push">
        The
        <dfn>NFC.push</dfn>(<var>message</var>, <var>options</var>)
        </code> method, when invoked, MUST run the
        <dfn>push a message</dfn> algorithm:
        <ol>
          <li>
            Return a new <a><code>Promise</code></a> <var>promise</var>, and
            then continue running this algorithm <a>in parallel</a>.
          </li>
          <li>
            If any exception occurs while running these steps, reject
            <var>promise</var> with that exception and abort these steps.
          </li>
          <li>
            If the <a>incumbent settings object</a> is not a
            <a>secure context</a>, reject <var>promise</var> with
            <code>"<a>SecurityError</a>"</code> and abort these steps.
            <div class="note">
              Browsers may ignore this rule for development purposes only.
            </div>
          </li>
          <li>
            An implementation MAY reject <var>promise</var> with <code>
            "<a>NotSupportedError</a>"</code> and abort these steps.
            <div class="note">
              The UA might terminate message push at this point. The reasons
              for terminations are implementation details. For example, the user
              could have has set a preference to allow a given origin only to
              read, write, or push data to peers. Also, the implementation might
               be unable to support the operation requested.
            </div>
          </li>
          <li>
            Let <var>target</var> be <var>options</var>.target.
          </li>
          <li>
            Let <var>timeout</var> be <var>options</var>.timeout.
          </li>
          <li>
            If the type of the <var>message</var> parameter is not
            <code>DOMString</code> or <code>ArrayBuffer</code>, and it is not an
            instance of <code>NFCMessage</code>, reject <var>promise</var>
            with <code>"SyntaxError"</code>, and abort these steps.
          </li>
          <li>
            If the <var>message</var> parameter is instance of
            <code>NFCMessage</code>, and <var>message</var>.data is an
            empty sequence, reject <var>promise</var> with
            <code>"SyntaxError"</code> and abort these steps.
          </li>
          <li>
            If <var>timeout</var> value is not valid or it is not supported
            by the UA, reject <var>promise</var> with
            <code>"SyntaxError"</code> and abort these steps.
          </li>
          <li>
            Let <var>output</var> be the notation for the <a>NDEF message</a>
            to be created by UA, as the result of passing
            <var>message</var> to <a>create Web NFC message</a>.
            If this throws an exception, reject <var>promise</var> with that
            exception and abort these steps.
          </li>
          <li>
            If <var>target</var> is <code>"any"</code>, run the following
            steps twice, once with <var>slot</var> set to the value
            <code>"tag"</code>, and once set to the value <code>"peer"</code>;
            otherwise run the following step once, with
            <var>slot</var> set to the value of <var>target</var>.
          </li>
          <ul>
            <li>
              If there are any existing instance of this algorithm running whose
              <var>target</var> is equal to <var>slot</var>, abort that
              instance of this algorithm by rejecting its <var>promise</var>
              with <code>"<a>AbortError</a>"</code>.
              <p class="note">
                In other words, the current invocation of <code>push()</code>
                rejects and replaces existing running invocations handling the
                same <var>slot</var>. At any given moment there may be
                maximum two instances of this algorithm running: one targeting
                <a>NFC tag</a>s, and another targeting <a>NFC peer</a>s.
              </p>
              <p class="note">
                Implementations are expected to clean up state on aborting these
                steps, e.g. stop the related timer, clear the related push
                message, as well as release any resources bound to NFC
                functionality, so that new invocations of this algorithm do not
                depend on previous invocations.
              </p>
            </li>
            <li>
              Associate <var>output</var> with <var>slot</var>.
            </li>
          </ul>
          <li>
            If <var>timeout</var> value is not equal to <code>Infinity</code>,
            start a timer <var>timer</var> with the timeout value set to
            <var>timeout</var>.
          </li>
          <li>
            Wait until one of the following events happens:
            <ul>
              <li>
                If <var>timer</var> expires, reject <var>promise</var> with
                <code>"TimeoutError"</code> and abort these steps.
              </li>
              <li>
                If the <a href="cancelPush"><code>cancelPush()</code></a>
                method is called while <var>timer</var> is active with
                <var>target</var> or <code>"any"</code>, then reject
                <var>promise</var> with <code>"<a>AbortError</a>"</code> and
                abort these steps, as described in the
                <a href="#steps-cancelPush"><code>cancelPush()</code> steps</a>.
              </li>
              <li>
                If an <a>NFC device</a> <var>device</var> comes within
                communication range, verify the following conditions:
                <ul>
                  <li>
                    if <var>device</var> is an <a>NFC tag</a>, <var>target</var>
                    is <code>"tag"</code> or <code>"any"</code>
                  </li>
                  <li>
                    if <var>device</var> is an <a>NFC peer</a>,
                    <var>target</var> is <code>"peer"</code> or
                    <code>"any"</code>
                  </li>
                  <li>
                    <var>this@[[\suspended]]</var> is <code>false</code>.
                  </li>
                </ul>
                In case of success, run the following sub-steps:
                <ol>
                  <li>
                    Stop <var>timer</var> if active.
                  </li>
                  <li>
                    If <var>device</var> is an <a>NFC tag</a>,
                    <ul>
                      <li>Read the tag.</li>
                      <li>
                        If <var>options</var>.ignoreRead is not equal to
                        <code>true</code>, run the
                        <a href="#steps-receiving">receiving steps</a>.
                      </li>
                      <li>
                        If the <a>Web NFC message origin</a> of the read
                        <a>NFC content</a> is <code>null</code>, or it is
                        different than the <a>ASCII serialized origin</a> of the
                        <a>incumbent settings object</a>, and the
                        <a>obtain push permission</a> steps return
                        <code>false</code>, then reject <var>promise</var> with
                        <code>"SecurityError"</code> and abort these steps.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Initiate data transfer to <var>device</var> using
                    <var>output</var> as buffer, using the <a>NFC adapter</a>
                    in communication range with (connected to)
                    <var>device</var>.
                  </li>
                  <li>
                    If the transfer fails, reject <var>promise</var> with
                    <code>"<a>NetworkError</a>"</code> and abort these
                    steps.
                    <p class="note">
                      Multiple adapters should be used sequentially by users.
                      There is very small likelihood that a simultaneous tap
                      will happen on two or multiple different and connected
                      <a>NFC adapter</a>s.
                      If it happens, the user will likely need to repeat the
                      taps until success, preferably one device at a time.
                      The error here gives an indication that the operation
                      needs to be repeated. Otherwise the user may think the
                      operation succeeded on all connected <a>NFC adapter</a>s.
                    </p>
                  </li>
                  <li>
                    When the transfer has completed, clear <var>output</var>
                    associated with <var>target</var>, resolve
                    <var>promise</var>.
                  </li>
                </ol>
              </li>
              <p class="note">
                If <var>this@[[\suspended]]</var> is <code>true</code>,
                continue waiting until <var>timer</var> expires (if set), or
                until <code>cancelPush()</code> is called, or until
                an <a>NFC device</a> comes within communication range.
              </p>
            </ul>
          </li>
        </ol>
      </p>

      <section><h3>Obtaining push permission</h3>
      <p>
        To <dfn>obtain push permission</dfn>, run these steps:
        <ol>
          <li>
            If there is a <a>prearranged trust relationship</a>,
            return <code>true</code>.
          </li>
          <li>
            Run the
            <a href="https://w3c.github.io/permissions/#dom-permissions-query">
            query permission status</a> steps for the
            <a>Web NFC permission name</a> until completion.
            <ul>
              <li>
                If it resolved with <code>
                <a href="https://w3c.github.io/permissions/#idl-def-PermissionState">
                "granted"</a></code> (i.e. an <a>expressed permission</a> has
                been granted to the <a>origin</a> and <a>global object</a> using
                the <a href="http://www.w3.org/TR/permissions/">
                Permissions API</a>), return <code>true</code>.
              </li>
              <li>
                Otherwise, if it resolved with <code>
                <a href="https://w3c.github.io/permissions/#idl-def-PermissionState">
                "prompt"</a></code>, then optionally
                <a href="https://w3c.github.io/permissions/#dom-permissions-request">
                request permission</a> from the user for the
                <a>Web NFC permission name</a>.
                If that is granted, return <code>true</code>.
                <p class="issue">
                  The
                  <a href="https://w3c.github.io/permissions/#dom-permissions-request">
                  request permission</a> steps are not yet clearly defined.
                  At this point the UA asks the user about the policy to be used
                  with the <a>Web NFC permission name</a> for the given
                  <a>origin</a> and <a>global object</a>, store the result
                  in the
                  <a href="https://w3c.github.io/permissions/#permission-store">
                  permission store</a>, and on success return <code>true</code>.
                </p>
              </li>
            </ul>
          </li>
          <li>
            Return <code>false</code>.
          </li>
        </ol>
      </p>
      </section>

      <section><h3>Creating Web NFC message</h3>
        <p>
          To <dfn>create Web NFC message</dfn> given a <var>message</var> run
          these steps:
        </p>
        <ol id="create-web-nfc-message">
          <li>
            Let <var>output</var> be the notation for the <a>NDEF message</a>
            to be created by the UA as a result of these steps.
          </li>
          <li>
            For each <a>NFCRecord</a> <var>record</var> in the sequence
            <var>message</var>.data, run the following steps, or make sure
            that the underlying platform provides equivalent values to
            <var>ndef</var>:
            <ol>
              <li>
                If <var>record</var>.recordType is <code>undefined</code>, then:
                <ol> <!-- guess type and mediaType from data -->
                  <li>
                    If <var>record</var>.data is instance of
                    <code>ArrayBuffer</code>, then
                    set <var>record</var>.mediaType to
                    <code>"application/octet-stream"</code> and
                    <var>record</var>.recordType to <code>"opaque"</code>.
                  </li>
                  <li>
                    Otherwise, if the type of <var>record</var>.data is
                    <code>"object"</code>, then set
                    <var>record</var>.mediaType to
                    <code>"application/json"</code> and
                    <var>record</var>.recordType to <code>"json"</code>.
                  </li>
                  <li>
                    Otherwise, if the type of <var>record</var>.data is
                    <code>"number"</code> or <code>"string"</code>, then
                    set <var>record</var>.mediaType to <code>"plain/text"</code>
                    and <var>record</var>.recordType to <code>"text"</code>.
                  </li>
                  <li>
                    Otherwise reject <var>promise</var> with
                    <code>"SyntaxError"</code> and abort these steps.
                  </li>
                </ol>
              </li>
              <li>
                If <var>record</var>.recordType is <code>"empty"</code>, then
                Let <var>ndef</var> be the result of passing <var>record</var>
                to <a>map empty record to NDEF</a>.
                If this throws an exception, reject <var>promise</var> with
                that exception and abort these steps.
              </li>
              <li>
                Otherwise, if <var>record</var>.recordType is <code>"text"</code>,
                then let <var>ndef</var> be the result of passing
                <var>record</var> to <a>map text to NDEF</a>.
                If this throws an exception, reject
                <var>promise</var> with that exception and abort these steps.
              </li>
              <li>
                Otherwise, if <var>record</var>.recordType is <code>"url"</code>,
                then let <var>ndef</var> the be result of passing
                <var>record</var> to <a>map a URL to NDEF</a>.
                If this throws an exception, reject <var>promise</var> with that
                exception and abort these steps.
              </li>
              <li>
                Otherwise, if <var>record</var>.recordType is <code>"json"</code>,
                then let <var>ndef</var> the be result of passing
                <var>record</var> to <a>map a JSON object to NDEF</a>.
                If this throws an exception, reject <var>promise</var> with that
                exception and abort these steps.
              </li>
              <li>
                Otherwise, if <var>record</var>.recordType is <code>"opaque"</code>,
                then let <var>ndef</var> the be result of passing
                <var>record</var> to <a>map binary data to NDEF</a>.
                If this throws an exception, reject <var>promise</var> with that
                exception and abort these steps.
              </li>
              <li>
                Add <var>ndef</var> to <var>output</var>.
              </li>
            </ol> <!-- converting each record -->
          </li> <!-- converting message -->
          <li>
            Let <var>webnfc</var> be the result of invoking
            <a>create a Web NFC record</a> given <var>message</var>.url.
            If this throws an exception, reject <var>promise</var> with that
            exception and abort these steps.
          </li>
          <li>
            Add <var>webnfc</var> to <var>output</var>.
            <p class="note">
              Implementations may choose the location of the Web NFC record
              within the <a>NDEF message</a>.
            </p>
          </li>
        </ol>
      </section>

      <section><h3>Mapping empty record to NDEF</h3>
      <p>
        To <dfn>map empty record to NDEF</dfn> given a <var>record</var>, run
        these steps:
        <ol>
          <li>
            Let <var>ndef</var> be the notation for the <a>NDEF record</a> to
            be created by the UA.
          </li>
          <li>Set the
            <var>ndef.TNF</var> field to 0 (NFC Empty Type record).
          </li>
          <li>Set
            <var>ndef.TYPE_LENGTH</var>,
            <var>ndef.ID_LENGTH</var> and
            <var>ndef.PAYLOAD_LENGTH</var> fields to 0,
            and omit the associated fields from the <a>NDEF record</a>:
            <var>ndef.TYPE</var>,
            <var>ndef.ID</var>,
            <var>ndef.PAYLOAD</var>.
          </li>
          <li>
            Return <var>ndef</var>.
          </li>
        </ol>
      </p>
      </section>

      <section><h3>Mapping string to NDEF</h3>
      <p>
        To <dfn>map text to NDEF</dfn> given a <var>record</var>, run these
        steps:
        <p class="note">
          This is useful when clients specifically want to write an
          NDEF Well Known Type Text record. Other options would be to
          use the value <code>"opaque"</code> with an explicit
          <a>IANA media type</a> text type, which allows for better
          differentiation, e.g. when using "text/xml", or "text/vcard".
        </p>
        <ol>
          <li>
            If <var>record</var>.data is not a string or number,
            throw a <code>"SyntaxError"</code> exception and abort these steps.
          </li>
          <li>
            If <var>record</var>.mediaType is not a string or starts with <code>
            "text/"</code>, then throw a <code>"SyntaxError"</code> exception
            and abort these steps.

            In addition, UAs MAY check that
            <var>record</var>.mediaType is an IANA registered media type
            for <a href="http://www.iana.org/assignments/media-types/media-types.xhtml#text">
            text</a>.
            If not, then the UA MAY throw a <code>"SyntaxError"</code>
            exception and abort these steps.
          </li>
          <li>
            Let <var>language</var> be <code>"en"</code>.

            If <var>record</var>.mediaType includes a <code>lang=</code>
            parameter, detailing the language encoding (e.g.
            "text/plain; lang=fr"), then set <var>language</var> to
            the language code extracted from <var>record</var>.mediaType.

            If <var>language</var> is not one of the language codes listed
            in the <a href="http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry">
            IANA language registry</a>
            (or [[ISO-639.2]]), then UAs MAY throw a <code>"SyntaxError"</code>
            exception and abort these steps.

            <p class="note">
              Note that <code>lang=</code> is not standard parameter
              to <a>IANA media type</a>s, but it is used in this specification
              in order to maintain compatibility with [[!NFC-STANDARDS]].
            </p>
          </li>
          <li>
            Let <var>ndef</var> be the notation for the <a>NDEF record</a> to
            be created by the UA.
          </li>
          <li>
            Set the <var>ndef.TNF</var> field to 1 (NFC Well Known Type).
          </li>
          <li>
            Set the <var>def.TYPE</var> field to <code>"T"</code>
            (value 0x54 following NFC binary encoding).
          </li>
          <li>
            Set the <var>ndef.PAYLOAD</var> field to
            <var>record</var>.data encoded according to the
            [[NFC-STANDARDS]], NFC Forum Text Record Type
            Definition specification:
            <ol>
              <li>
                The first octet is a status byte containing bit flags.
                <ol>
                  <li>
                    If <var>record</var>.mediaType contains the parameter
                    "charset=UTF-8" (e.g. "text/plain; charset=UTF-8;"),
                    then set bit 7 (MSB) to 0 (UTF-8 encoding),
                    otherwise to 1 (UTF-16 encoding).
                  </li>
                  <li>Set bit 6 to 0.</li>
                  <li>
                    Set bits 5 to 0 to the length of the
                    <var>language</var> string.
                  </li>
                </ol>
              </li>
              <li>
                Set the consecutive octets of <var>ndef.PAYLOAD</var>
                to the value of <var>language</var> encoded as US-ASCII.
              </li>
              <li>
                Set the consecutive payload octets to
                <var>record</var>.data in the encoding set by the
                MSB bit of the first payload octet (by default UTF-16,
                or UTF-8 on special request).
              </li>
            </ol>
          </li>
          <li>
            Return <var>ndef</var>.
          </li>
        </ol>
      </p>
      </section>

      <section><h3>Mapping URL to NDEF</h3>
      <p>
        To <dfn>map a URL to NDEF</dfn> given a <var>record</var>, run these
        steps:
        <ol>
          <li>
            If <var>record</var>.data is not a string,
            throw a <code>"SyntaxError"</code> exception and abort these steps.
          </li>
          <li>
            Let <var>ndef</var> be the notation for the <a>NDEF record</a> to
            be created by the UA.
          </li>
          <li>
            Set the <var>ndef.TNF</var> field to 1 (Well Known Type).
          </li>
          <li>
            Set the <var>ndef.TYPE</var> field to "U" (0x55
            following NFC binary encoding).
          </li>
          <li>
            Set the <var>ndef.PAYLOAD</var> field to
            <var>record</var>.data encoded according to the
            [[NFC-STANDARDS]], NFC Forum URI Record Type Definition
            specification: set the first octet according to the
            applicable scheme abbreviation, and set the rest of the
            payload bytes to <var>record</var>.data in UTF-8 encoding.
          </li>
          <li>
            Return <var>ndef</var>.
          </li>
        </ol>
      </p>
      </section>

      <section><h3>Mapping JSON to NDEF</h3>
      <p>
        To <dfn>map a JSON object to NDEF</dfn> given a <var>record</var>,
        run these steps:
        <ol>
          <li>
            Let <var>data</var> be the result of
            <a data-lt="JSON.stringify">serializing</a> <var>record</var>.data
            and if that throws, throw a <code>"TypeError"</code> exception
            and abort these steps.
          </li>
          <li>
            If <var>record</var>.mediaType doesn't match
            <code>"application/json"</code>, or any other
            <a>IANA media type</a> for JSON
            (starting with <code>"application/"</code> and ending with <code>
            "+json"</code>), throw a <code>"SyntaxError"</code> exception and
            abort these steps.
          </li>
          <li>
            Let <var>ndef</var> be the notation for the <a>NDEF record</a> to
            be created by the UA.
          </li>
          <li>
            Set the <var>ndef.TNF</var> field to 2 (Media Type).
          </li>
          <li>
            Set the <var>ndef.TYPE</var> field to <var>record</var>.mediaType.
          </li>
          <li>
            Set the <var>ndef.PAYLOAD</var> field to <var>data</var>
            according to the [[NFC-STANDARDS]], i.e. as an opaque octet stream.
          </li>
          <li>
            Return <var>ndef</var>.
          </li>
        </ol>
      </p>
      </section>

      <section><h3>Mapping binary data to NDEF</h3>
      <p>
        To <dfn>map binary data to NDEF</dfn> given a <var>record</var>,
        run these steps:
        <ol>
          <li>
            If <var>record</var>.data is not of instance of
            <code>ArrayBuffer</code>, reject <var>promise</var> with
            <code>"SyntaxError"</code> and abort these steps.
          </li>
          <li>
            The UA MAY check if <var>record</var>.mediaType is
            a valid IANA registered type. If not, then MAY throw a <code>
            "SyntaxError"</code> exception and abort these steps.
          </li>
          <li>
            Let <var>ndef</var> be the notation for the <a>NDEF record</a> to
            be created by the UA.
          </li>
          <li>
            Set the <var>ndef.TNF</var> field to 2 (Media Type).
          </li>
          <li>
            Set the <var>ndef.TYPE</var> field to <var>record</var>.mediaType.
          </li>
          <li>
            Set the <var>ndef.PAYLOAD</var> field to <var>record</var>.data
            according to the [[NFC-STANDARDS]], i.e. as an opaque octet stream.
          </li>
          <li>
            Return <var>ndef</var>.
          </li>
        </ol>
      </p>
      </section>

      <section><h3>Creating a Web NFC record</h3>
      <p>
        To <dfn>create a <a>Web NFC record</a></dfn> given <var>url</var>,
        run these steps:
        <ol>
          <li>
            Let <var>ndef</var> be the notation for the <a>NDEF record</a> to
            be created by the UA.
          </li>
          <li>
            Set <var>ndef.TNF</var> to 4 (NDEF External Type).
          </li>
          <li>
            Set <var>ndef.TYPE</var> to
            <code>"urn:nfc:ext:w3.org:webnfc"</code>.
          </li>
          <li>
            Let <var>payload</var> be the result of invoking
            <a>create a Web NFC Id</a> given <var>url</var>.
            If this throws an exception, re-throw it.
          </li>
          <li>
            Set <var>ndef.PAYLOAD</var> to the <a>URL path</a> of the
            <a>browsing context</a>, encoded as UTF-16.
            This is going to be used by <a>NFC watch</a> filters.
            <p class="note">
              In future versions a list of "allowed-origins" may be
              supported.
              It is still up for discussions due to security issues. See the
              <a href="http://w3c.github.io/web-nfc/security-privacy.html#security-and-privacy-context-of-nfc">
              Security and Privacy</a> document.
            </p>
          </li>
          <li>
            Return <var>ndef</var>.
          </li>
        </ol>
      </p>
      </section>

      <section><h3>Creating a Web NFC Id</h3>
      <p>
        To <dfn>create a <a>Web NFC Id</a></dfn> given <var>url</var>,
        run these steps:
        <ol>
          <li>
            Let <var>id</var> be the <a>ASCII serialized origin</a> of the
            <a>browsing context</a>, appended with <var>url</var>.
          </li>
          <li>
            If <var>id</var> is a not a valid <a>URL</a>, throw a
            <code>"SyntaxError"</code> exception and abort these steps.
            <p class="note">
              This means <var>url</var> should be a valid <a>URL path</a>.
            </p>
          </li>
          <li>
            Return <var>id</var>, encoded in UTF-16.
          </li>
        </ol>
      </p>
      </section>
    </section> <!-- push() -->

    <section id="cancelPush"><h3>The cancelPush method</h3>
      <p>
        The <code>
        <dfn>NFC.cancelPush</dfn>(target)</code>
        method, when invoked, MUST run <dfn>cancel push</dfn> algorithm:
      </p>
      <ol id="steps-cancelPush">
        <li>
          Return a new <a><code>Promise</code></a> <var>promise</var> and
          then continue running this algorithm <a>in parallel</a>.
        </li>
        <li>
          If the <a>incumbent settings object</a> is not a
          <a>secure context</a>, reject <var>promise</var> with
          <code>"<a>SecurityError</a>"</code> and abort these steps.
          <div class="note">
            Browsers may ignore this rule for development purposes only.
          </div>
        </li>
        <li>
          If there is an instance of the <code><a>NFC.push</a>()</code>
          algorithm running with its <var>options.</var>target equal to
          <var>target</var> or <code>"any"</code>, then
          <ol>
            <li>
              Stop the instance's <var>timer</var> if it is active.
            </li>
            <li>
              If the instance has already initiated NFC data transfer,
              reject <var>promise</var> with
              <code>"<a>NoModificationAllowedError</a>"</code> and abort these
              steps.
            </li>
            <li>
              Reject the instance's pending <var>promise</var> with
              <code>"<a>AbortError</a>"</code> and abort the steps of the
              instance.
            </li>
          </ol>
          <li>
            Resolve <var>promise</var>.
          </li>
        </li>
      </ol>
      <p class="note">
        The <code>cancelPush()</code> method does not <i>interrupt</i> ongoing
        transfers, it only cancels pushing <i>before</i> an <a>NFC device</a>
        comes in range.
      </p>
    </section>
  </section> <!-- Writing or pushing content -->

  <section> <h3>Watching for content</h3>
    <p>
      In order to receive <a>NFC content</a>, the client needs to call the
      <a>NFC.watch</a>() to opt into content of interest.
    </p>

    <section> <h3>Match patterns</h3>
      <p>
        A <a>match pattern</a> is defined by the following ABNF:
        <pre>
          <dfn data-lt="match pattern">match-pattern</dfn>       = <a>top-level type name</a> <code>"/"</code> [ tree <code>"."</code> ] <a>subtype name</a> [ <code>"+"</code> suffix ] [ <code>";"</code> parameters ]
          <dfn>top-level type name</dfn> = <code>"*"</code> / &lt;VCHAR except <code>'/'</code> and <code>"*"</code>&gt;
          <dfn>subtype name</dfn>        = <code>"*"</code> / &lt;VCHAR except <code>'+'</code>&gt;
        </pre>
        A <a>match pattern</a> is a
        <a href="http://pubs.opengroup.org/onlinepubs/007904875/utilities/xcu_chap02.html#tag_02_13_03">
        glob</a> used for matching <a>IANA media type</a>s,
        for instance the pattern <code>'application/*+json'</code> matches
        <code>'application/calendar+json'</code>, but does not match
        <code>'application/json'</code>. The pattern
        <code>'* /*json'</code>, on the other hand, matches both.
      </p>
    </section>
    <section> <h3>URL patterns</h3>
      <p>
        A <a>URL pattern</a> is a URL which may contain the <code>'*'</code>
        wildcard character.
        It consists of a <a data-lt="star scheme">scheme</a>, a
        <a data-lt="star host">host</a> and (optionally) a
        <a data-lt="star path">path</a>, defined by the following ABNF:
        <pre>
          <dfn data-lt="url pattern">url-pattern</dfn> = <a data-lt="star scheme">scheme</a> <code>"://"</code> <a data-lt="star host">host</a> <a data-lt="star path">path</a>
          <dfn data-lt="star scheme">scheme</dfn>      = <code>"*"</code> / <code>"https"</code>
          <dfn data-lt="star host">host</dfn>        = <code>"*"</code> / <code>"*."</code> &lt;VCHAR except <code>"/"</code> and <code>"*"</code>&gt;
          <dfn data-lt="star path">path</dfn>        = <code>"/"</code> &lt;VCHAR&gt;
        </pre>
      </p>
      <p>
        Most characters match themselves, however <code>'*'</code> (wildcard)
        matches a sequence of visible characters. A <a>URL pattern</a> that
        doesn't conform to the above ABNF is a non-match.
      </p>
      <p class="note">
        Though <code>'*'</code> matches a sequence of characters, only URLs
        with scheme <code>"https"</code> are accepted in the algorithms
        taking a <a>URL pattern</a>.
      </p>
      <p>
        For example, <code>'*://*.mydomain.com/*'</code> will match
        <code>'https://services.mydomain.com/myservice1/myapp2/'</code> and
        <code>'https://info.mydomain.com/general/'</code>.
      </p>
    </section>
    <section> <h3>The <strong>watch()</strong> method</h3>
      <p>
        This method enables listening to incoming <a>NDEF message</a>s.
        The <a>NFC content</a> to which clients listen can be filtered based on
        its data type, and based on the <a>URL path</a> of the
        <a>browsing context</a> which has been saved to the <a>Web NFC record</a>
        of the <a>NFC content</a>. The latter is matched against
        <a>URL pattern</a>s used in <a>NFC watch</a>es.
      </p>
      <p>
        An <dfn>NFC watch</dfn> is referring to a
        <code><a>NFCWatchOptions</a></code> filter saved together with the
        <code><a>NFC</a></code> instance it belongs
        to, and a locally unique identifier which is used for cancellation.
        The section <a href="#steps-receiving">
        Receiving and parsing content</a> uses <a>NFC watch</a>es to match
        incoming <a>NFC content</a>.
      </p>
      <p>
        Multiple consecutive calls to the <code>watch()</code> method from the
        same <a>origin</a> create filters which are in OR relationship.
      </p>
      <p>
        When the <code>
        <dfn>NFC.watch</dfn>(<var>callback</var>, <var>options</var>)
        </code> method is invoked, the UA MUST run the following
        <dfn id="steps-watch">NFC watch algorithm</dfn>:
        <ol>
          <li>
            Let <var>promise</var> be a new <a><code>Promise</code></a> object.
          </li>
          <li>
            Return <var>promise</var> and continue the following steps
            <a>in parallel</a>.
          </li>
          <li>
            If any exception occurs while running these steps, reject
            <var>promise</var> with that exception and abort these steps.
          </li>
          <li>
            If the <a>incumbent settings object</a> is not a
            <a>secure context</a>, reject <var>promise</var> with
            <code>"<a>SecurityError</a>"</code> and abort these steps.
            <div class="note">
              Browsers may ignore this rule for development purposes only.
            </div>
          </li>
          <li>
            If there is no support for the functionality of receiving data from
            an <a>NFC peer</a> or <a>NFC tag</a> in proximity range, reject
            <var>promise</var> with <code>"NotSupportedError"</code> and
            abort these steps.
          </li>
          <li>
            If the <a>obtain watch permission</a> steps return
            <code>false</code>, then reject <var>promise</var> with
            <code>"SecurityError"</code> and abort these steps.
          </li>
          <li>
            If this is the first watch being set up, then make a request to
            all <a>NFC adapter</a>s to listen to <a>NDEF message</a>s.
          </li>
          <li>
            If the request fails, reject <var>promise</var> with
            <code>"NotSupportedError"</code> and abort these steps.
          </li>
          <li>
            Let <var>watchId</var> be a number that will identify this
            <a>NFC watch</a>.
          </li>
          <li>
            Add <var>watchId</var>, <var>options</var>, and <var>callback</var>
            together as an <a>NFC watch</a> to <var>this@[[\watchList]]</var>.
          </li>
          <li>
            Resolve <var>promise</var> with <var>watchId</var>.
          </li>
          <li>
            If the <a>browsing context</a> loses focus (e.g. the user navigated
            to another page), then the registered watches still SHOULD continue
            to exist, but SHOULD become paused, i.e. the UA SHOULD NOT check
            and use them until the focus is regained.
          </li>
        </ol>
      </p>
      <p>
        To <dfn>obtain watch permission</dfn>, run these steps:
        <ol>
          <li>
            If there is a <a>prearranged trust relationship</a>,
            return <code>true</code>.
          </li>
          <li>
            Otherwise, if the user has earlier denied permission for the calling
            <a>origin</a> for all future calls of <code>watch()</code> as well,
            then return <code>false</code>.
          </li>
          <li>
            Otherwise, UAs SHOULD
            <a href="#askforgiveness">ask for forgiveness</a> with relevant
            information displayed to the user.
            <p class="note">
              The <a href="#askforgiveness">ask for forgiveness</a> interaction
              might show choices like "block now" or "block forever", etc.
              If the user has chosen to "block forever" the given
              <a>origin</a>, it is the responsibility of the UA to remember
              these user choices for each <a>origin</a>, regardless of which
              <a>NFC adapter</a> is used, and consult them on later invocations.
            </p>
            <p class="note">
             In this step UAs are advised to notify users about
             that reading <a>NFC content</a> may indirectly reveal the physical
             location of the user. In addition, if <code>"any"</code>
             <code><a>NFCWatchMode</a></code> is used, then also include in this
             information that the <a>origin</a> is requesting to read not only
             <a>NFC content</a> meant for web pages, but any <a>NFC content</a>.
            </p>
          </li>
          <li>
            Return <code>true</code>.
          </li>
        </ol>
      </p>
    </section> <!-- watch() method -->

    <!-- The cancelWatch() method -->
    <section><h3>The <strong>cancelWatch</strong>() method</h3>
      <p>
        When the <code><dfn>NFC.cancelWatch</dfn>(id)</code> method is
        invoked, the UA MUST return a <a><code>Promise</code></a>
        <var>promise</var> and run the following steps <a>in parallel</a>.
        <ol id="steps-cancelWatch">
          <li>
            If the <a>incumbent settings object</a> is not a
            <a>secure context</a>, reject <var>promise</var> with
            <code>"<a>SecurityError</a>"</code> and abort these steps.
            <div class="note">
              Browsers may ignore this rule for development purposes only.
            </div>
          </li>
          <li>
            If the parameter <var>id</var> is <code>undefined</code>, then
            remove all watches and filters set by successive calls of the
            <code><a>NFC watch</a>()</code> method on all <a>NFC adapter</a>s.
          </li>
          <li>
            Otherwise, if the parameter <var>id</var> matches the local
            identifier of one of the previously set up watches, remove the
            corresponding watch.
          </li>
          <li>
            Otherwise, reject <var>promise</var> with
            <code>"<a>NotFoundError</a>"</code> and abort these steps.
          </li>
          <li>
            If there are no more watches, then make a request to stop listening
            to <a>NDEF message</a>s on all <a>NFC adapter</a>s.
          </li>
          <li>
            Resolve <var>promise</var>.
          </li>
        </ol>
      </p>
    </section> <!-- cancelWatch() -->
  </section>

  <section id="steps-receiving">
  <h3>Receiving and parsing content</h3>
  <p>
    If there are any <a>NFC watch</a>es set up in <var>NFC@[[\watchList]]</var>,
    then UAs MUST listen to <a>NDEF message</a>s, according to step 7
    of the <a href="#steps-watch">NFC watch algorithm</a>.
  </p>
  <section><h3>The NDEF parsing algorithm</h3>
    When the <a>UA</a> is to <dfn>receive an NDEF message</dfn> it MUST run the
    following algorithm:
    <p class="note">
       The UA SHOULD represent an unformatted <a>NFC tag</a> as an
       <a>NDEF message</a> containing a single empty <a>NDEF record</a>.
    </p>
    <ol id ="parse-ndef">
      <li>
        If <var>NFC@[[\suspended]]</var> is <code>true</code>, abort
        these steps.
      </li>
      <li>
        Let <var>message</var> be a new <code>NFCMessage</code> object, with
        <var>message</var>.url set to <code>null</code> and
        <var>message</var>.data set to empty sequence.
      </li>
      <li>
        Let <var>input</var> be the notation for the <a>NDEF message</a>
        which has been received.
      </li>
      <li>
        For each <a>NDEF record</a> which is part of <var>input</var>, run the
        following sub-steps for <dfn>parsing NDEF record</dfn>:
        <ol>
          <li>
            Let <var>ndef</var> be the notation for the current
            <a>NDEF record</a>. The fields of <var>ndef</var> are described by
            the [[NFC-STANDARDS]].
          </li>
          <li>
            Let <var>record</var> be a new <code><a>NFCRecord</a></code> object.
          </li>
          <li>
            If <var>ndef.TNF</var> is 0 (NFC Empty Record), then set
            <var>record</var>.recordType to <code>"empty"</code> and set
            <var>record</var>.mediaType to <code>""</code>.
          </li>
          <li>
            If <var>ndef.TNF</var> is 1 (NFC Well Known Type Record), and
            <var>ndef.TYPE</var> is <code>"T"</code> (value 0x54 following NFC
            binary encoding), then run the following sub-steps for
            <dfn>parsing NDEF Text record</dfn>, or ensure that the
            underlying platform provides equivalent values to the
            <var>record</var> object properties:
            <ol>
              <li>Set <var>record</var>.recordType to <code>"text"</code>.</li>
              <li>
                Set <var>record</var>.mediaType to <code>"text/plain"</code>.
              </li>
              <li>
                Read the first octet of <var>ndef.PAYLOAD</var>.
                Let <var>offset</var> be the value given by bits 5 to 0 of the
                first payload octet.
              </li>
              <li>
                Let <var>language</var> be the string defined by the consecutive
                <var>offset</var> number of octets, converted from US-ASCII
                encoding. Append <code>";lang="</code> and then the value of
                <var>language</var> to <var>record</var>.mediaType.
              </li>
              <li>
                Set <var>record</var>.data to the string created from the
                consecutive <var>ndef.PAYLOAD</var> octets, converted to UTF-16
                encoding.
              </li>
            </ol>
          </li> <!-- reading NDEF Text record -->
          <li>
            If <var>ndef.TNF</var> is 1 (NFC Well Known Type Record), and
            <var>ndef.TYPE</var> is <code>"U"</code> (value 0x55 in NFC binary
            encoding), then run the following sub-steps for
            <dfn>parsing NDEF URL record</dfn>, or make sure that the
            underlying platform provides equivalent values to the
            <var>record</var> object properties:
            <ol>
              <li>Set <var>record</var>.recordType to <code>"url"</code>.</li>
              <li>
                Set <var>record</var>.mediaType to <code>"text/plain"</code>.
              </li>
              <li>
                Let <var>scheme</var> be the value of the first octet of
                <var>ndef.PAYLOAD</var>.
              </li>
              <li>
                If <var>scheme</var> is not 0, then set <var>record</var>.data
                to the string obtained from mapping the value of
                <var>scheme</var> to the URL scheme as specified in the
                [[NFC-STANDARDS]] URI Record Type Definition specification,
                Section 3.2.2.
              </li>
              <li>
                Set <var>record</var>.data to the UTF-16 string converted from
                the octets of <var>ndef.PAYLOAD</var> except the first octet.
              </li>
            </ol>
          </li> <!-- parsing NDEF URL record -->
          <li>
            If <var>ndef.TNF</var> is 3 (NFC Absolute URI Type record), then
            set <var>record</var>.recordType to <code>"url"</code>,
            set <var>record</var>.mediaType to <code>"text/plain"</code> and
            set <var>record</var>.data to the string converted from
            <var>ndef.PAYLOAD</var>.
          </li> <!-- parsing NDEF Absolute URI record -->
          <li>
            If <var>ndef.TNF</var> is 2 (NFC Media Type record), then run
            the following sub-steps for <dfn>parsing NDEF Media record</dfn>, or
            make sure that the underlying platform provides equivalent values to
            the <var>record</var> object properties:
            <ol>
              <li>
                If <var>ndef.TYPE</var> matches the <a>match pattern</a>
                <code>"application/*json"</code>, then
                <ol>
                  <li>Set <var>record</var>.recordType to <code>"json"</code>.</li>
                  <li>
                    Set <var>record</var>.mediaType to <var>ndef.TYPE</var>.
                  </li>
                  <li>
                    Let <var>payload</var> be <var>ndef.PAYLOAD</var> converted
                    to UTF-16, and set <var>record</var>.data to the result of
                    <a data-lt="JSON.parse">parsing</a> <var>payload</var>.
                    If <a data-lt="JSON.parse">parsing</a> throws an error,
                    skip to the next <a>NDEF record</a>.
                  </li>
                </ol>
              </li>
              <li>
                Otherwise,
                <ol>
                  <li>Set <var>record</var>.recordType to <code>"opaque"</code>.</li>
                  <li>
                    Set <var>record</var>.mediaType to <var>ndef.TYPE</var>.
                  </li>
                  <li>
                    Set <var>record</var>.data to a new <code>ArrayBuffer</code>
                    object constructed from the octets of
                    <var>ndef.PAYLOAD</var>.
                  </li>
                </ol>
              </li>
            </ol>
          </li> <!-- parsing NDEF Media record -->
          <li>
            If <var>ndef.TNF</var> is 4 (NFC External Type record), and
            <var>ndef.TYPE</var> is <code>urn:nfc:ext:w3.org:webnfc</code>,
            then set <var>message</var>.url to the value decoded from
            <var>ndef.PAYLOAD</var> in UTF-16.
          </li> <!-- parsing Web NFC record -->
          <li>
            Otherwise, if <var>ndef.TNF</var> is 4 (NFC External Type record),
            or 5 (NFC Unknown Type record) then run the following sub-steps,
            or make sure that the underlying platform provides equivalent values
            to the <var>record</var> object properties:
            <ol>
              <li>Set <var>record</var>.recordType to <code>"opaque"</code>.</li>
              <li>
                If <var>ndef.TYPE</var> is defined, then set
                <var>record</var>.mediaType to that string value, otherwise to
                <code>"application/octet-stream"</code>.
              </li>
              <li>
                Set <var>record</var>.data to a new <code>ArrayBuffer</code>
                object constructed from the octets of <var>ndef.PAYLOAD</var>.
              </li>
            </ol>
          </li> <!-- parsing NDEF External/Unknown record -->
          <li>
            Otherwise, skip to the next <a>NDEF record</a> in <var>input</var>.
          </li>
          <li>
            Add <var>record</var> to <var>message</var>.data.
          </li>
        </ol>
      </li>
      <li>
        If <var>NFC@[[\suspended]]</var> is <code>false</code> and
        <var>message</var>.data is not empty, run the
        <a>dispatch NFC content</a> steps given <var>message</var>.
      </li>
    </ol>
    </section>

    <section><h3>Dispatching NFC content</h3>
    <p>
      To <dfn>dispatch NFC content</dfn> given a <var>message</var> of type
      <code><a>NFCMessage</a></code> run these steps:
    </p>
    <ol>
      <li>
        For each <a>NFC watch</a> <var>watch</var> that has
        been registered using the <code>watch()</code> method in
        <var>this@[[\watchList]]</var>, run the following sub-steps:
        <ol>
          <li>
            Let <var>options</var> be the <code><a>NFCWatchOptions</a></code>
            saved with <var>watch</var>, and let <var>callback</var> be the
            registered callback function.
          </li>
          <li>
            If <var>options</var>.mode is <code>"web-nfc-only"</code> and
            <var>message</var>.url is <var>null</var>, skip to the next
            <a>NFC watch</a>.
          </li>
          <li>
            Otherwise, if <var>options</var>.mode is <code>"any"</code>,
            set <var>options</var>.url to <code>""</code>.
          </li>
          <li>
            If the <a>URL pattern</a> <var>options</var>.url is not
            <code>""</code> and it does not match <var>message</var>.url,
            skip to the next <a>NFC watch</a>.
          </li>
          <li>
            If <var>options</var>.recordType is not <code>""</code> and it is not
            equal to any <var>record</var>.recordType where <var>record</var> is an
            element of <var>message</var>, skip to the next <a>NFC watch</a>.
          </li>
          <li>
            If <var>options</var>.mediaType is not <code>""</code> and it is not
            equal to any <var>record</var>.mediaType where <var>record</var> is
            an element of <var>message</var>, skip to the next <a>NFC watch</a>.
          </li>
          <li>
            <a>Queue a task</a> using the <dfn>Web NFC task source</dfn>
            to invoke the <code>MessageCallback</code> <var>callback</var>
            with <var>message</var> as its argument.
          </li>
        </ol>
      </li>
    </ol>
    </section>
  </section> <!-- receiving content -->
</section> <!-- NFC interface -->


<!-- - - - - - - - - - - - - - -  Changes - - - - - - - - - - - - - - - - - -->
<section class="appendix" id="Changes"><h2>Changes</h2>
  <p>
    The following is a list of substantial changes to the document. For a
    complete list of changes, see the <a href=
    "https://github.com/w3c/web-nfc/commits/gh-pages">change log on
    Github</a>. You can also view the <a href=
    "https://github.com/w3c/web-nfc/issues?page=1&amp;state=closed">
    recently closed bugs</a>.
  </p>
  <ul>
    <li>Corrections in the usage of origin.</li>
    <li>Defined <code><a>NFCRecordData</a></code> as explicit union.</li>
    <li>Defined <code><a>NFCMessage</a></code> as a dictionary.</li>
    <li>Improved definitions for URL and match pattern.</a>
    <li>Added section for handling visibility and focus.</li>
    <li>Added internal slots to <code><a>NFC</a></code>.</li>
    <li>Changed push policy for background pages.</li>
    <li>Changed receive policy for background pages.</li>
    <li>Updated security policies and related algorithmic steps.</li>
  </ul>
</section>

<!-- - - - - - - - - - - - - - - Open issues - - - - - - - - - - - - - - - -->
<section> <h3 class="appendix" id="openissues">Open issues</h3>
  <p>
    The following problems are being discussed and need most attention:
    <ul>
      <li>
        <a href="https://github.com/w3c/web-nfc/issues/2">
        Verify security model.</a>
      </li>
      <li>
        <a href="https://github.com/w3c/web-nfc/issues/3">
        Suggest a permission UI flow.</a>
      </li>
      <li>
        <a href="https://github.com/w3c/web-nfc/issues/40">
        Simplify process for obtaining permissions.</a>
      </li>
      <li>
        <a href="https://github.com/w3c/web-nfc/issues/17">
        Using service workers and protocol handlers.</a>
      </li>
      <li>
        <a href="https://github.com/w3c/web-nfc/issues/53">
        How much needs to be hidden from pages that lose focus during NFC
        operations?</a>
      </li>
    </ul>
    This version addresses the issues above, and also other issues.
  </p>
</section>

<!-- - - - - - - - - - - - - - - Acknowledgements - - - - - - - - - - - - - -->
<section> <h2>Acknowledgements</h2>
  <p>
    The editors would like to thank Jeffrey Yasskin, Anne van Kesteren,
    Anssi Kostiainen, Alexander Shalamov, Domenic Denicola, Jonas Sicking,
    Don Coleman, Salvatore Iovene and Rijubrata Bhaumik for their
    contributions to this document.

    Special thanks goes to the former editors Luc Yriarte and Samuel Ortiz
    for their initial work on exposing NFC to the Web Platform, and for
    their supports for our new approach.
  </p>
</section>

</body>
</html>

*/});
  });

  it('should parse the NFC spec', function() {
    var res = parser.parseString(nfcSpecHTML);
    if ( ! res ) fail('Parse failed');
    if ( res.pos !== nfcSpecHTML.length ) fail('Failed to consume string');
    expect(res.value).toBeDefined();
  });
});
