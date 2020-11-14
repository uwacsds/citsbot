import { academicDeadlinesParser } from "./deadlines-parser";
import { Deadline } from "./types";

describe('deadlines-parser', () => {
  const now = new Date('2020-01-01');
  const parser = academicDeadlinesParser(() => now);

  it('should parse unit links from cssubmit main page', () => {
    expect(parser.parseUnitLinks(rawUnitsPageHtml)).toEqual([
      { code: 'CITS1001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS1001-2' },
      { code: 'CITS1402', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS1402-2' },
      { code: 'CITS2002', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS2002-2' },
      { code: 'CITS2402', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS2402-2' },
      { code: 'CITS3001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3001-2' },
      { code: 'CITS3200', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3200-2' },
      { code: 'CITS4001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4001-2' },
      { code: 'CITS4002', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4002-2' },
      { code: 'CITS4009', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4009-2' },
      { code: 'CITS4419', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4419-2' },
      { code: 'CITS5013', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5013-2' },
      { code: 'CITS5014', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5014-2' },
      { code: 'CITS5015', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5015-2' },
      { code: 'CITS5206', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5206-2' },
      { code: 'CITS5507', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5507-2' },
      { code: 'CITS1001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS1001-1' },
      { code: 'CITS2200', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS2200-1' },
      { code: 'CITS3002', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3002-1' },
      { code: 'CITS3003', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3003-1' },
      { code: 'CITS3401', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3401-1' },
      { code: 'CITS3403', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS3403-1' },
      { code: 'CITS4001', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4001-1' },
      { code: 'CITS4401', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4401-1' },
      { code: 'CITS4407', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS4407-1' },
      { code: 'CITS5013', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5013-1' },
      { code: 'CITS5014', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5014-1' },
      { code: 'CITS5501', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5501-1' },
      { code: 'CITS5504', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5504-1' },
      { code: 'CITS5505', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5505-1' },
      { code: 'CITS5508', link: 'https://secure.csse.uwa.edu.au/run/cssubmit?p=np&open=CITS5508-1' },
    ]);
  });

  it('should parse deadlines from cssubmit unit page', () => {
    expect(parser.parseUnitDeadlines('CITS1001', rawCITS1001DeadlinesHtml)).toEqual([
      { unit: 'CITS1001', date: new Date('2020-09-25T17:00:00.000+08:00'), title: 'Project 1, contributing 15%' },
      { unit: 'CITS1001', date: new Date('2020-11-13T17:00:00.000+08:00'), title: 'Project 2, contributing 25%' },
    ]);
    expect(parser.parseUnitDeadlines('CITS3200', rawCITS3200DeadlinesHtml)).toEqual([
      { unit: 'CITS3200', date: new Date('2020-08-19T23:59:00.000+08:00'), title: 'Sprint 1 team deliverables, contributing 5%' },
      { unit: 'CITS3200', date: new Date('2020-08-21T23:59:00.000+08:00'), title: 'Sprint 1 Personal Reflection, contributing 5%' },
      { unit: 'CITS3200', date: new Date('2020-09-11T23:59:00.000+08:00'), title: 'PDP' },
      { unit: 'CITS3200', date: new Date('2020-09-16T23:59:00.000+08:00'), title: 'Sprint 2 team deliverables, contributing 10%' },
      { unit: 'CITS3200', date: new Date('2020-09-18T23:59:00.000+08:00'), title: 'Sprint 2 Personal Reflection, contributing 5%' },
      { unit: 'CITS3200', date: new Date('2020-10-21T23:59:00.000+08:00'), title: 'Sprint 3 team deliverables, contributing 15%' },
      { unit: 'CITS3200', date: new Date('2020-10-23T23:59:00.000+08:00'), title: 'Sprint 3 Personal Reflection, contributing 5%' },
    ]);
  });
});

const rawUnitsPageHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" id="oldcore">
<head>

<script language="JavaScript" type="text/JavaScript"
    src="/newcss/visualid_scripts_id-core_r218.js"></script>

<script language="JavaScript" type="text/JavaScript">
    try { document.execCommand("BackgroundImageCache", false, true); } catch(err) {}
</script>

    <link rel="stylesheet" type="text/css" href="/newcss/visualid_oldcore_uwa_id_core_r333.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_page_types_uwa_landing_page.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_themes_faculty_ems.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_uwa_id_print.css" media="print" />
    <link rel="stylesheet" type="text/css" href="/newcss/CSM-ems.css" media="all" />
    <script type="text/JavaScript" src="/newcss/CSM-SCROLLRSS.js"></script>

<script type="text/JavaScript">
<!--
function popup(mylink, windowname)
{
    if (! window.focus)return true;
    var href;
    if (typeof(mylink) == 'string')
       href=mylink;
    else
       href=mylink.href;
    window.open(href, windowname, 'width=600,height=600,scrollbars=yes');
    return false;
}
//-->
</script>

<style>
#headercontainer {
    padding-top: 1px;
    padding-bottom: 4px;
    border-top: 0px;
    height: 130;
    background: url(/newcss/graphics/header-background-02.jpg) bottom center repeat-x #27348B;
    border-bottom: 0px;
}
</style>

<link rel="stylesheet" href="//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
<script>
  $(function() {
   $('input').filter('.datepicker').datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: "dd-MM-yy"
    });
  } );
</script>
<style type="text/css">
.ui-datepicker-header {
   background: #ce7019;
}
.ui-datepicker {
   color: #ce7019;
}
</style>

<!-- Items specific to cssubmit -->

<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<link rel="stylesheet" href="/cshelp/cshelp-highlight/hljs.css">
<script src="/cshelp/cshelp-highlight/hljs.js"></script>

<script>hljs.initHighlightingOnLoad();</script>


<title>cssubmit</title>

</head>

<body>
<div id="bodycontainer" style="padding-left: 0px;">

<!--begin #IEroot targeting [by Hiroki Chalfant]-->
<!--[if IE]><div id="ieAny"><![endif]-->
<!--[if lte IE 6]><div id="ie6down"><![endif]-->
<!--[if IE 7]><div id="ie7"><![endif]-->
<!--[if gte IE 8]><div id="ie8up"><![endif]-->

    <!-- Topmost block, including the search form -->
    <div id="headercontainer" style="margin-left: 0px;">

    <div class="outerwrapper">
    <div class="sizer">
    <div class="expander">
    <div class="wrapper">
    
    <div class="mainheaderouter">
        <div class="mainheader">

            <img style="display: none; width: 2500px; height: 74px;"
id="print_header" width="2500" height="74" src="/newcss/graphics/uwacrest-print.gif" alt="" />
            <div class="logo"><a href="http://uwa.edu.au/"><img id="uwa_crest" alt="The University of Western Australia" height="54" src="/newcss/graphics/uwacrest.png" /></a>
	    </div>

            <div style="color: white; font-size: 1.5em; text-align: right; vertical-align: middle;">
	    <br>Faculty of Engineering and Mathematical Sciences&nbsp;
	    </div>

        </div>

    </div>

    <div class="searchbarouter">
        <div class="searchbar">

            <div class="formblock">
                     <form action="https://www.uwa.edu.au/search.php3" method="get" name="uwasearch" id="uwasearch" onsubmit="return checkForm()">
                        <input type="hidden" name="site" value="search" />
                        <input type="hidden" name="hl" value="en" />
                        <input type="hidden" name="thisurl" value="http://www.ems.uwa.edu.au" />
                        <table border="0" cellpadding="0" cellspacing="0" summary="Search the University of Western Australia's Website">
                            <tr>
                                <td><label for="words">Search the UWA website</label><input type="text" class="searchbox" name="words" id="words" value="Search" onfocus="clearText(this)" />
				</td>

                                <td>
                                    <label for="query">Search the UWA website</label>
                                    <select name="query" id="query">
<option label="UWA Website" value="search">UWA Website</option>
<option label="People" value="person">People</option>
<option label="UWA Expertise" value="xpert">UWA Expertise</option>
<option label="Structure" value="department">Structure</option>
<option label="Intranet" value="intranet">Intranet</option>
                                    </select>
                                </td>

                                <td><label for="submitsearch">Submit My
Search</label><input type="image" value="Submit" src="/newcss/graphics/search-button-go.gif" name="submitsearch" id="submitsearch" alt="Go" title="Go" />
				</td>
                            </tr>
                        </table>
                    </form>
            </div>

	    <div class="searchlinks" id="content_div_11469">
<a class="nav" href="http://www.ems.uwa.edu.au">Faculty Home</a>
<a class="nav" href="http://web.csse.uwa.edu.au/">Department Home</a>
<a class="nav" href="https://secure.csse.uwa.edu.au/run/csentry">csentry</a>
			<a class="nav" href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np">cssubmit</a>
	    </div>
       </div>
    </div><!--end #searchbarouter-->

    </div><!-- end .wrapper -->
    </div><!-- end .expander -->
    </div><!-- end .sizer -->
    </div><!-- end .outerwrapper -->

</div><!--end #headercontainer-->

<!--[if lte IE 7]>
<p>
<![endif]-->

<table style="width: 100%;"><tr><td style="text-align: left; padding: 4px;">


<table style="width: 100%;"><tr>
	<td class="csm-inforow" style="width: 20%;">Not logged in (<a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;login=y">login</a>)</td>
</tr></table>

<table class="csm-pagebanner"><tr><td class="csm-pagebannerleft">

<h2 class="csm-pagebanner">cssubmit</h2>
<div class="csm-pagebannerdesc">
<br>

This program lists all assessment deadlines of units offered by
Computer Science &amp; Software Engineering in
<span style="color: red;"><b>2020</b></span>,
and enables students to submit their
CSSE assignments and projects over the web.
Please contact your unit coordinator about any deadlines not listed here.
<p></p>
</td>

<!--

When marked assignments are announced as available,
you may collect them from the CSSE front office on
Tuesdays and Thursdays, between 1pm and 5pm.

<td width="260" style="background: url('/images/cssubmit/homework-m.jpg') no-repeat top right; vertical-align: top;">
    <img src="/newcss/graphics/dotoverlay260160.gif">
</td>
-->
</tr></table>

<table style="width: 100%;"><tr>
	<td class="csm-optionrow">
	<form action="https://secure.csse.uwa.edu.au/run/cssubmit?p=np" method="GET">
	Options:	<select name="option" onChange="this.form.submit()">
		<option value="?">Select an option</option>
	<optgroup label="108 deadlines found">
		<option value="l">deadlines listed by unitcode</option>
		<option value="t">pending deadlines</option>
		<option value="c">deadlines listed on a calendar</option>
		<option value="w">deadlines listed week-by-week</option>
	</optgroup>
	</select>
	</form>
	</td>

	<td class="csm-optionrow" style="text-align: left;">
	<form action="https://secure.csse.uwa.edu.au/run/cssubmit?p=np" method="GET">
	Jump to:
	<select name="jumpto2" onChange="this.form.submit()">
	<optgroup label="Information">
		<option value="csentry">csentry</option>
		<option value="csforum">csforum</option>
		<option selected value="cssubmit">cssubmit</option>
		<option value="csmarks">csmarks</option>
		<option value="csbreakdown">csbreakdown</option>
	</optgroup>
	<optgroup label="cshelp - 2nd semester">
		<option value="help1001">help1001&nbsp;&nbsp;&nbsp;software engineering with java</option>
		<option value="help1402">help1402&nbsp;&nbsp;&nbsp;relational database management systems</option>
		<option value="help2002">help2002&nbsp;&nbsp;&nbsp;systems programming</option>
		<option value="help2211">help2211&nbsp;&nbsp;&nbsp;discrete structures</option>
		<option value="help2402">help2402&nbsp;&nbsp;&nbsp;introduction to data science</option>
		<option value="help3001">help3001&nbsp;&nbsp;&nbsp;algorithms, agents, and artificial intelligence</option>
		<option value="help3200">help3200&nbsp;&nbsp;&nbsp;professional computing</option>
		<option value="help4009">help4009&nbsp;&nbsp;&nbsp;computational data analysis</option>
		<option value="help4404">help4404&nbsp;&nbsp;&nbsp;artificial intelligence &amp; adaptive systems</option>
		<option value="help4419">help4419&nbsp;&nbsp;&nbsp;mobile &amp; wireless computing</option>
		<option value="help5502">help5502&nbsp;&nbsp;&nbsp;software processes</option>
		<option value="help5503">help5503&nbsp;&nbsp;&nbsp;cloud computing</option>
		<option value="help5206">help5206&nbsp;&nbsp;&nbsp;professional computing</option>
		<option value="help5507">help5507&nbsp;&nbsp;&nbsp;high performance computing</option>
	</optgroup>
	<optgroup label="cshelp - 1st semester">
		<option value="help1001">help1001&nbsp;&nbsp;&nbsp;software engineering with java</option>
		<option value="help2200">help2200&nbsp;&nbsp;&nbsp;data structures &amp; algorithms</option>
		<option value="help3002">help3002&nbsp;&nbsp;&nbsp;computer networks</option>
		<option value="help3003">help3003&nbsp;&nbsp;&nbsp;graphics &amp; animation</option>
		<option value="help3401">help3401&nbsp;&nbsp;&nbsp;data warehousing</option>
		<option value="help3403">help3403&nbsp;&nbsp;&nbsp;agile web development</option>
		<option value="help4008">help4008&nbsp;&nbsp;&nbsp;scientific communication</option>
		<option value="help4402">help4402&nbsp;&nbsp;&nbsp;computer vision</option>
		<option value="help4401">help4401&nbsp;&nbsp;&nbsp;software requirements &amp; design</option>
		<option value="help4403">help4403&nbsp;&nbsp;&nbsp;computational modelling</option>
		<option value="help4406">help4406&nbsp;&nbsp;&nbsp;problem solving and programming</option>
		<option value="help4407">help4407&nbsp;&nbsp;&nbsp;open source tools &amp; scripting</option>
		<option value="help5501">help5501&nbsp;&nbsp;&nbsp;software testing &amp; quality assurance</option>
		<option value="help5504">help5504&nbsp;&nbsp;&nbsp;data warehousing</option>
		<option value="help5505">help5505&nbsp;&nbsp;&nbsp;agile web development</option>
	</optgroup>
	</select>
	</form>
	</td>
</tr></table>

<table class="thin" style="width: 100%;">
<tr><td class="thin" colspan="3">

<table class="csm-pagebanner">
<tr>
	<td class="csm-pagebannerleft">
	<h3 class="csm-pagebanner">Deadlines of semester 2, 2020</h3>
	</td>
</tr>
</table>

</td></tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS1001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1001-2">SOFTWARE ENGINEERING WITH JAVA</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS1402-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1402-2">RELATIONAL DATABASE MANAGEMENT SYSTEMS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS2002-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2002-2">SYSTEMS PROGRAMMING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS2402-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2402-2">INTRODUCTION TO DATA SCIENCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3001-2">ALGORITHMS, AGENTS AND ARTIFICIAL INTELLIGENCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3200-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3200-2">PROFESSIONAL COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4001-2">CSSE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4002-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4002-2">CSSE RESEARCH PROJECT PART 2</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4009-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4009-2">COMPUTATIONAL DATA ANALYSIS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4419-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4419-2">MOBILE AND WIRELESS COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5013-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5013-2">DATA SCIENCE RESEARCH PROJECT PART 3</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5014-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5014-2">DATA SCIENCE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5015-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5015-2">DATA SCIENCE RESEARCH PROJECT PART 2</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5206-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5206-2">PROFESSIONAL COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5507-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5507-2">HIGH PERFORMANCE COMPUTING</a></td>
</tr>
<tr><td class="thin" colspan="3">

<table class="csm-pagebanner">
<tr>
	<td class="csm-pagebannerleft">
	<h3 class="csm-pagebanner">Deadlines of semester 1, 2020</h3>
	</td>
</tr>
</table>

</td></tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS1001-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1001-1">SOFTWARE ENGINEERING WITH JAVA</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS2200-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2200-1">DATA STRUCTURES AND ALGORITHMS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3002-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3002-1">COMPUTER NETWORKS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3003-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3003-1">GRAPHICS AND ANIMATION</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3401-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3401-1">DATA WAREHOUSING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3403-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3403-1">AGILE WEB DEVELOPMENT</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4001-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4001-1">CSSE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4401-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4401-1">SOFTWARE REQUIREMENTS AND DESIGN</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4407-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4407-1">OPEN SOURCE TOOLS AND SCRIPTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5013-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5013-1">DATA SCIENCE RESEARCH PROJECT PART 3</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5014-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5014-1">DATA SCIENCE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5501-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5501-1">SOFTWARE TESTING AND QUALITY ASSURANCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5504-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5504-1">DATA WAREHOUSING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5505-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5505-1">AGILE WEB DEVELOPMENT</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5508-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5508-1">MACHINE LEARNING</a></td>
</tr>
</table>

  </td></tr>
</table>

<!-- Begin footer -->

<div id="footercontainer" style="padding-left: 182px;">

    <div class="outerwrapper">
    <div class="sizer">
    <div class="expander">
    <div class="wrapper">

    <div class="footercontent">


<div class="footercol1" id="content_div_199">
<div class="footercol1title">
  The University of Western Australia
</div>

<ul>
<li><a href="https://www.uwa.edu.au/">University Homepage</a></li>
<li><a href="https://www.studyat.uwa.edu.au">Future Students</a></li>
<li><a href="https://www.uwa.edu.au/current">Current Students</a></li>
<li><a href="https://uwa.edu.au/staff">Staff</a></li>
<li><a href="https://uwa.edu.au/business2">Business and industry</a></li>
<li><a href="https://www.development.uwa.edu.au/alumni">Alumni and Friends</a></li>
<li><a href="https://uwa.edu.au/media">Media</a></li>
</ul>
</div>

<!--
<div id="footersitemap" class="footercol">
<strong>Faculty of Engineering, Computing and Mathematics</strong>
<ul>
  <li><a href="https://www.ecm.uwa.edu.au/courses">Courses</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/research">Research</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/alumni">Alumni</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/business">Business and industry</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/community">Community</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/students">Current Students</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/staff">Staff</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/contact">Contact us</a></li>
</ul>
</div>
-->

<div class="footercol" id="content_div_195">
<strong>University information</strong><br>
<acronym title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</acronym> Code: 00126G

<ul>
<li><a href="https://uwa.edu.au/accessibility">Accessibility</a></li>
<li><a href="https://uwa.edu.au/campus_map">Campus map</a></li>
<li><a href="https://uwa.edu.au/contact">Contact the University</a></li>
<li><a href="https://uwa.edu.au/indigenous_commitment">Indigenous Commitment</a></li>
<li><a href="https://uwa.edu.au/terms_of_use">Terms of use</a></li>
</ul>
</div><!-- end .footercol -->

<div class="footercol lastcol">
<strong>This Page</strong><br>
    <p></br>
    Program&nbsp;written&nbsp;by:&nbsp;<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="f8bb908a918bd6b59bbc979699949cb88d8f99d69d9c8dd6998d">[email&#160;protected]</a><br>
    Feedback&nbsp;welcome<br>
    Last&nbsp;modified:&nbsp;&nbsp;5:11am&nbsp;Oct&nbsp;29&nbsp;2020</p>
<!--
    <p><img style="width: 180px;" src="/images/csmarks15.jpg"></p>
-->
</div><!-- end .footercol .lastcol -->

</div><!-- end .wrapper -->
</div><!-- end .expander -->
</div><!-- end .sizer -->
</div><!-- end .outerwrapper -->
    
</div><!-- end .footercontainer -->		

<!--[if IE]></div></div><![endif]--><!--end #IEroot targeting-->
</div><!--end #bodycontainer-->

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script></body>
</html>
`

const rawCITS1001DeadlinesHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" id="oldcore">
<head>

<script language="JavaScript" type="text/JavaScript"
    src="/newcss/visualid_scripts_id-core_r218.js"></script>

<script language="JavaScript" type="text/JavaScript">
    try { document.execCommand("BackgroundImageCache", false, true); } catch(err) {}
</script>

    <link rel="stylesheet" type="text/css" href="/newcss/visualid_oldcore_uwa_id_core_r333.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_page_types_uwa_landing_page.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_themes_faculty_ems.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_uwa_id_print.css" media="print" />
    <link rel="stylesheet" type="text/css" href="/newcss/CSM-ems.css" media="all" />
    <script type="text/JavaScript" src="/newcss/CSM-SCROLLRSS.js"></script>

<script type="text/JavaScript">
<!--
function popup(mylink, windowname)
{
    if (! window.focus)return true;
    var href;
    if (typeof(mylink) == 'string')
       href=mylink;
    else
       href=mylink.href;
    window.open(href, windowname, 'width=600,height=600,scrollbars=yes');
    return false;
}
//-->
</script>

<style>
#headercontainer {
    padding-top: 1px;
    padding-bottom: 4px;
    border-top: 0px;
    height: 130;
    background: url(/newcss/graphics/header-background-02.jpg) bottom center repeat-x #27348B;
    border-bottom: 0px;
}
</style>

<link rel="stylesheet" href="//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
<script>
  $(function() {
   $('input').filter('.datepicker').datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: "dd-MM-yy"
    });
  } );
</script>
<style type="text/css">
.ui-datepicker-header {
   background: #ce7019;
}
.ui-datepicker {
   color: #ce7019;
}
</style>

<!-- Items specific to cssubmit -->

<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<link rel="stylesheet" href="/cshelp/cshelp-highlight/hljs.css">
<script src="/cshelp/cshelp-highlight/hljs.js"></script>

<script>hljs.initHighlightingOnLoad();</script>


<title>cssubmit</title>

</head>

<body>
<div id="bodycontainer" style="padding-left: 0px;">

<!--begin #IEroot targeting [by Hiroki Chalfant]-->
<!--[if IE]><div id="ieAny"><![endif]-->
<!--[if lte IE 6]><div id="ie6down"><![endif]-->
<!--[if IE 7]><div id="ie7"><![endif]-->
<!--[if gte IE 8]><div id="ie8up"><![endif]-->

    <!-- Topmost block, including the search form -->
    <div id="headercontainer" style="margin-left: 0px;">

    <div class="outerwrapper">
    <div class="sizer">
    <div class="expander">
    <div class="wrapper">
    
    <div class="mainheaderouter">
        <div class="mainheader">

            <img style="display: none; width: 2500px; height: 74px;"
id="print_header" width="2500" height="74" src="/newcss/graphics/uwacrest-print.gif" alt="" />
            <div class="logo"><a href="http://uwa.edu.au/"><img id="uwa_crest" alt="The University of Western Australia" height="54" src="/newcss/graphics/uwacrest.png" /></a>
	    </div>

            <div style="color: white; font-size: 1.5em; text-align: right; vertical-align: middle;">
	    <br>Faculty of Engineering and Mathematical Sciences&nbsp;
	    </div>

        </div>

    </div>

    <div class="searchbarouter">
        <div class="searchbar">

            <div class="formblock">
                     <form action="https://www.uwa.edu.au/search.php3" method="get" name="uwasearch" id="uwasearch" onsubmit="return checkForm()">
                        <input type="hidden" name="site" value="search" />
                        <input type="hidden" name="hl" value="en" />
                        <input type="hidden" name="thisurl" value="http://www.ems.uwa.edu.au" />
                        <table border="0" cellpadding="0" cellspacing="0" summary="Search the University of Western Australia's Website">
                            <tr>
                                <td><label for="words">Search the UWA website</label><input type="text" class="searchbox" name="words" id="words" value="Search" onfocus="clearText(this)" />
				</td>

                                <td>
                                    <label for="query">Search the UWA website</label>
                                    <select name="query" id="query">
<option label="UWA Website" value="search">UWA Website</option>
<option label="People" value="person">People</option>
<option label="UWA Expertise" value="xpert">UWA Expertise</option>
<option label="Structure" value="department">Structure</option>
<option label="Intranet" value="intranet">Intranet</option>
                                    </select>
                                </td>

                                <td><label for="submitsearch">Submit My
Search</label><input type="image" value="Submit" src="/newcss/graphics/search-button-go.gif" name="submitsearch" id="submitsearch" alt="Go" title="Go" />
				</td>
                            </tr>
                        </table>
                    </form>
            </div>

	    <div class="searchlinks" id="content_div_11469">
<a class="nav" href="http://www.ems.uwa.edu.au">Faculty Home</a>
<a class="nav" href="http://web.csse.uwa.edu.au/">Department Home</a>
<a class="nav" href="https://secure.csse.uwa.edu.au/run/csentry">csentry</a>
			<a class="nav" href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np">cssubmit</a>
	    </div>
       </div>
    </div><!--end #searchbarouter-->

    </div><!-- end .wrapper -->
    </div><!-- end .expander -->
    </div><!-- end .sizer -->
    </div><!-- end .outerwrapper -->

</div><!--end #headercontainer-->

<!--[if lte IE 7]>
<p>
<![endif]-->

<table style="width: 100%;"><tr><td style="text-align: left; padding: 4px;">


<table style="width: 100%;"><tr>
	<td class="csm-inforow" style="width: 20%;">Not logged in (<a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;login=y">login</a>)</td>
</tr></table>

<table class="csm-pagebanner"><tr><td class="csm-pagebannerleft">

<h2 class="csm-pagebanner">cssubmit</h2>
<div class="csm-pagebannerdesc">
<br>

This program lists all assessment deadlines of units offered by
Computer Science &amp; Software Engineering in
<span style="color: red;"><b>2020</b></span>,
and enables students to submit their
CSSE assignments and projects over the web.
Please contact your unit coordinator about any deadlines not listed here.
<p></p>
</td>

<!--

When marked assignments are announced as available,
you may collect them from the CSSE front office on
Tuesdays and Thursdays, between 1pm and 5pm.

<td width="260" style="background: url('/images/cssubmit/homework-m.jpg') no-repeat top right; vertical-align: top;">
    <img src="/newcss/graphics/dotoverlay260160.gif">
</td>
-->
</tr></table>

<table style="width: 100%;"><tr>
	<td class="csm-optionrow">
	<form action="https://secure.csse.uwa.edu.au/run/cssubmit?p=np" method="GET">
	Options:	<select name="option" onChange="this.form.submit()">
		<option value="?">Select an option</option>
	<optgroup label="108 deadlines found">
		<option value="l">deadlines listed by unitcode</option>
		<option value="t">pending deadlines</option>
		<option value="c">deadlines listed on a calendar</option>
		<option value="w">deadlines listed week-by-week</option>
	</optgroup>
	</select>
	</form>
	</td>

	<td class="csm-optionrow" style="text-align: left;">
	<form action="https://secure.csse.uwa.edu.au/run/cssubmit?p=np" method="GET">
	Jump to:
	<select name="jumpto2" onChange="this.form.submit()">
	<optgroup label="Information">
		<option value="csentry">csentry</option>
		<option value="csforum">csforum</option>
		<option selected value="cssubmit">cssubmit</option>
		<option value="csmarks">csmarks</option>
		<option value="csbreakdown">csbreakdown</option>
	</optgroup>
	<optgroup label="cshelp - 2nd semester">
		<option value="help1001">help1001&nbsp;&nbsp;&nbsp;software engineering with java</option>
		<option value="help1402">help1402&nbsp;&nbsp;&nbsp;relational database management systems</option>
		<option value="help2002">help2002&nbsp;&nbsp;&nbsp;systems programming</option>
		<option value="help2211">help2211&nbsp;&nbsp;&nbsp;discrete structures</option>
		<option value="help2402">help2402&nbsp;&nbsp;&nbsp;introduction to data science</option>
		<option value="help3001">help3001&nbsp;&nbsp;&nbsp;algorithms, agents, and artificial intelligence</option>
		<option value="help3200">help3200&nbsp;&nbsp;&nbsp;professional computing</option>
		<option value="help4009">help4009&nbsp;&nbsp;&nbsp;computational data analysis</option>
		<option value="help4404">help4404&nbsp;&nbsp;&nbsp;artificial intelligence &amp; adaptive systems</option>
		<option value="help4419">help4419&nbsp;&nbsp;&nbsp;mobile &amp; wireless computing</option>
		<option value="help5502">help5502&nbsp;&nbsp;&nbsp;software processes</option>
		<option value="help5503">help5503&nbsp;&nbsp;&nbsp;cloud computing</option>
		<option value="help5206">help5206&nbsp;&nbsp;&nbsp;professional computing</option>
		<option value="help5507">help5507&nbsp;&nbsp;&nbsp;high performance computing</option>
	</optgroup>
	<optgroup label="cshelp - 1st semester">
		<option value="help1001">help1001&nbsp;&nbsp;&nbsp;software engineering with java</option>
		<option value="help2200">help2200&nbsp;&nbsp;&nbsp;data structures &amp; algorithms</option>
		<option value="help3002">help3002&nbsp;&nbsp;&nbsp;computer networks</option>
		<option value="help3003">help3003&nbsp;&nbsp;&nbsp;graphics &amp; animation</option>
		<option value="help3401">help3401&nbsp;&nbsp;&nbsp;data warehousing</option>
		<option value="help3403">help3403&nbsp;&nbsp;&nbsp;agile web development</option>
		<option value="help4008">help4008&nbsp;&nbsp;&nbsp;scientific communication</option>
		<option value="help4402">help4402&nbsp;&nbsp;&nbsp;computer vision</option>
		<option value="help4401">help4401&nbsp;&nbsp;&nbsp;software requirements &amp; design</option>
		<option value="help4403">help4403&nbsp;&nbsp;&nbsp;computational modelling</option>
		<option value="help4406">help4406&nbsp;&nbsp;&nbsp;problem solving and programming</option>
		<option value="help4407">help4407&nbsp;&nbsp;&nbsp;open source tools &amp; scripting</option>
		<option value="help5501">help5501&nbsp;&nbsp;&nbsp;software testing &amp; quality assurance</option>
		<option value="help5504">help5504&nbsp;&nbsp;&nbsp;data warehousing</option>
		<option value="help5505">help5505&nbsp;&nbsp;&nbsp;agile web development</option>
	</optgroup>
	</select>
	</form>
	</td>
</tr></table>

<table class="thin" style="width: 100%;">
<tr><td class="thin" colspan="3">

<table class="csm-pagebanner">
<tr>
	<td class="csm-pagebannerleft">
	<h3 class="csm-pagebanner">Deadlines of semester 2, 2020</h3>
	</td>
</tr>
</table>

</td></tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS1001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1001-2">SOFTWARE ENGINEERING WITH JAVA</a></td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">1.</span>&nbsp;&nbsp;Project 1, contributing 15%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">submissions closed at 5:00pm Fri 25th Sep, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">2.</span>&nbsp;&nbsp;Project 2, contributing 25%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">submissions closed at 5:00pm Fri 13th Nov, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS1402-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1402-2">RELATIONAL DATABASE MANAGEMENT SYSTEMS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS2002-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2002-2">SYSTEMS PROGRAMMING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS2402-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2402-2">INTRODUCTION TO DATA SCIENCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3001-2">ALGORITHMS, AGENTS AND ARTIFICIAL INTELLIGENCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3200-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3200-2">PROFESSIONAL COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4001-2">CSSE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4002-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4002-2">CSSE RESEARCH PROJECT PART 2</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4009-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4009-2">COMPUTATIONAL DATA ANALYSIS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4419-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4419-2">MOBILE AND WIRELESS COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5013-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5013-2">DATA SCIENCE RESEARCH PROJECT PART 3</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5014-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5014-2">DATA SCIENCE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5015-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5015-2">DATA SCIENCE RESEARCH PROJECT PART 2</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5206-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5206-2">PROFESSIONAL COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5507-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5507-2">HIGH PERFORMANCE COMPUTING</a></td>
</tr>
<tr><td class="thin" colspan="3">

<table class="csm-pagebanner">
<tr>
	<td class="csm-pagebannerleft">
	<h3 class="csm-pagebanner">Deadlines of semester 1, 2020</h3>
	</td>
</tr>
</table>

</td></tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS1001-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1001-1">SOFTWARE ENGINEERING WITH JAVA</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS2200-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2200-1">DATA STRUCTURES AND ALGORITHMS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3002-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3002-1">COMPUTER NETWORKS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3003-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3003-1">GRAPHICS AND ANIMATION</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3401-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3401-1">DATA WAREHOUSING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3403-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3403-1">AGILE WEB DEVELOPMENT</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4001-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4001-1">CSSE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4401-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4401-1">SOFTWARE REQUIREMENTS AND DESIGN</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4407-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4407-1">OPEN SOURCE TOOLS AND SCRIPTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5013-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5013-1">DATA SCIENCE RESEARCH PROJECT PART 3</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5014-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5014-1">DATA SCIENCE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5501-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5501-1">SOFTWARE TESTING AND QUALITY ASSURANCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5504-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5504-1">DATA WAREHOUSING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5505-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5505-1">AGILE WEB DEVELOPMENT</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5508-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5508-1">MACHINE LEARNING</a></td>
</tr>
</table>

  </td></tr>
</table>

<!-- Begin footer -->

<div id="footercontainer" style="padding-left: 182px;">

    <div class="outerwrapper">
    <div class="sizer">
    <div class="expander">
    <div class="wrapper">

    <div class="footercontent">


<div class="footercol1" id="content_div_199">
<div class="footercol1title">
  The University of Western Australia
</div>

<ul>
<li><a href="https://www.uwa.edu.au/">University Homepage</a></li>
<li><a href="https://www.studyat.uwa.edu.au">Future Students</a></li>
<li><a href="https://www.uwa.edu.au/current">Current Students</a></li>
<li><a href="https://uwa.edu.au/staff">Staff</a></li>
<li><a href="https://uwa.edu.au/business2">Business and industry</a></li>
<li><a href="https://www.development.uwa.edu.au/alumni">Alumni and Friends</a></li>
<li><a href="https://uwa.edu.au/media">Media</a></li>
</ul>
</div>

<!--
<div id="footersitemap" class="footercol">
<strong>Faculty of Engineering, Computing and Mathematics</strong>
<ul>
  <li><a href="https://www.ecm.uwa.edu.au/courses">Courses</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/research">Research</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/alumni">Alumni</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/business">Business and industry</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/community">Community</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/students">Current Students</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/staff">Staff</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/contact">Contact us</a></li>
</ul>
</div>
-->

<div class="footercol" id="content_div_195">
<strong>University information</strong><br>
<acronym title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</acronym> Code: 00126G

<ul>
<li><a href="https://uwa.edu.au/accessibility">Accessibility</a></li>
<li><a href="https://uwa.edu.au/campus_map">Campus map</a></li>
<li><a href="https://uwa.edu.au/contact">Contact the University</a></li>
<li><a href="https://uwa.edu.au/indigenous_commitment">Indigenous Commitment</a></li>
<li><a href="https://uwa.edu.au/terms_of_use">Terms of use</a></li>
</ul>
</div><!-- end .footercol -->

<div class="footercol lastcol">
<strong>This Page</strong><br>
    <p></br>
    Program&nbsp;written&nbsp;by:&nbsp;<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="eaa982988399c4a789ae85848b868eaa9f9d8bc48f8e9fc48b9f">[email&#160;protected]</a><br>
    Feedback&nbsp;welcome<br>
    Last&nbsp;modified:&nbsp;&nbsp;5:11am&nbsp;Oct&nbsp;29&nbsp;2020</p>
<!--
    <p><img style="width: 180px;" src="/images/csmarks15.jpg"></p>
-->
</div><!-- end .footercol .lastcol -->

</div><!-- end .wrapper -->
</div><!-- end .expander -->
</div><!-- end .sizer -->
</div><!-- end .outerwrapper -->
    
</div><!-- end .footercontainer -->		

<!--[if IE]></div></div><![endif]--><!--end #IEroot targeting-->
</div><!--end #bodycontainer-->

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script></body>
</html>
`;

const rawCITS3200DeadlinesHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" id="oldcore">
<head>

<script language="JavaScript" type="text/JavaScript"
    src="/newcss/visualid_scripts_id-core_r218.js"></script>

<script language="JavaScript" type="text/JavaScript">
    try { document.execCommand("BackgroundImageCache", false, true); } catch(err) {}
</script>

    <link rel="stylesheet" type="text/css" href="/newcss/visualid_oldcore_uwa_id_core_r333.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_page_types_uwa_landing_page.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_themes_faculty_ems.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/newcss/designs_uwa_id_print.css" media="print" />
    <link rel="stylesheet" type="text/css" href="/newcss/CSM-ems.css" media="all" />
    <script type="text/JavaScript" src="/newcss/CSM-SCROLLRSS.js"></script>

<script type="text/JavaScript">
<!--
function popup(mylink, windowname)
{
    if (! window.focus)return true;
    var href;
    if (typeof(mylink) == 'string')
       href=mylink;
    else
       href=mylink.href;
    window.open(href, windowname, 'width=600,height=600,scrollbars=yes');
    return false;
}
//-->
</script>

<style>
#headercontainer {
    padding-top: 1px;
    padding-bottom: 4px;
    border-top: 0px;
    height: 130;
    background: url(/newcss/graphics/header-background-02.jpg) bottom center repeat-x #27348B;
    border-bottom: 0px;
}
</style>

<link rel="stylesheet" href="//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
<script>
  $(function() {
   $('input').filter('.datepicker').datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: "dd-MM-yy"
    });
  } );
</script>
<style type="text/css">
.ui-datepicker-header {
   background: #ce7019;
}
.ui-datepicker {
   color: #ce7019;
}
</style>

<!-- Items specific to cssubmit -->

<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<link rel="stylesheet" href="/cshelp/cshelp-highlight/hljs.css">
<script src="/cshelp/cshelp-highlight/hljs.js"></script>

<script>hljs.initHighlightingOnLoad();</script>


<title>cssubmit</title>

</head>

<body>
<div id="bodycontainer" style="padding-left: 0px;">

<!--begin #IEroot targeting [by Hiroki Chalfant]-->
<!--[if IE]><div id="ieAny"><![endif]-->
<!--[if lte IE 6]><div id="ie6down"><![endif]-->
<!--[if IE 7]><div id="ie7"><![endif]-->
<!--[if gte IE 8]><div id="ie8up"><![endif]-->

    <!-- Topmost block, including the search form -->
    <div id="headercontainer" style="margin-left: 0px;">

    <div class="outerwrapper">
    <div class="sizer">
    <div class="expander">
    <div class="wrapper">
    
    <div class="mainheaderouter">
        <div class="mainheader">

            <img style="display: none; width: 2500px; height: 74px;"
id="print_header" width="2500" height="74" src="/newcss/graphics/uwacrest-print.gif" alt="" />
            <div class="logo"><a href="http://uwa.edu.au/"><img id="uwa_crest" alt="The University of Western Australia" height="54" src="/newcss/graphics/uwacrest.png" /></a>
	    </div>

            <div style="color: white; font-size: 1.5em; text-align: right; vertical-align: middle;">
	    <br>Faculty of Engineering and Mathematical Sciences&nbsp;
	    </div>

        </div>

    </div>

    <div class="searchbarouter">
        <div class="searchbar">

            <div class="formblock">
                     <form action="https://www.uwa.edu.au/search.php3" method="get" name="uwasearch" id="uwasearch" onsubmit="return checkForm()">
                        <input type="hidden" name="site" value="search" />
                        <input type="hidden" name="hl" value="en" />
                        <input type="hidden" name="thisurl" value="http://www.ems.uwa.edu.au" />
                        <table border="0" cellpadding="0" cellspacing="0" summary="Search the University of Western Australia's Website">
                            <tr>
                                <td><label for="words">Search the UWA website</label><input type="text" class="searchbox" name="words" id="words" value="Search" onfocus="clearText(this)" />
				</td>

                                <td>
                                    <label for="query">Search the UWA website</label>
                                    <select name="query" id="query">
<option label="UWA Website" value="search">UWA Website</option>
<option label="People" value="person">People</option>
<option label="UWA Expertise" value="xpert">UWA Expertise</option>
<option label="Structure" value="department">Structure</option>
<option label="Intranet" value="intranet">Intranet</option>
                                    </select>
                                </td>

                                <td><label for="submitsearch">Submit My
Search</label><input type="image" value="Submit" src="/newcss/graphics/search-button-go.gif" name="submitsearch" id="submitsearch" alt="Go" title="Go" />
				</td>
                            </tr>
                        </table>
                    </form>
            </div>

	    <div class="searchlinks" id="content_div_11469">
<a class="nav" href="http://www.ems.uwa.edu.au">Faculty Home</a>
<a class="nav" href="http://web.csse.uwa.edu.au/">Department Home</a>
<a class="nav" href="https://secure.csse.uwa.edu.au/run/csentry">csentry</a>
			<a class="nav" href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np">cssubmit</a>
	    </div>
       </div>
    </div><!--end #searchbarouter-->

    </div><!-- end .wrapper -->
    </div><!-- end .expander -->
    </div><!-- end .sizer -->
    </div><!-- end .outerwrapper -->

</div><!--end #headercontainer-->

<!--[if lte IE 7]>
<p>
<![endif]-->

<table style="width: 100%;"><tr><td style="text-align: left; padding: 4px;">


<table style="width: 100%;"><tr>
	<td class="csm-inforow" style="width: 20%;">Not logged in (<a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;login=y">login</a>)</td>
</tr></table>

<table class="csm-pagebanner"><tr><td class="csm-pagebannerleft">

<h2 class="csm-pagebanner">cssubmit</h2>
<div class="csm-pagebannerdesc">
<br>

This program lists all assessment deadlines of units offered by
Computer Science &amp; Software Engineering in
<span style="color: red;"><b>2020</b></span>,
and enables students to submit their
CSSE assignments and projects over the web.
Please contact your unit coordinator about any deadlines not listed here.
<p></p>
</td>

<!--

When marked assignments are announced as available,
you may collect them from the CSSE front office on
Tuesdays and Thursdays, between 1pm and 5pm.

<td width="260" style="background: url('/images/cssubmit/homework-m.jpg') no-repeat top right; vertical-align: top;">
    <img src="/newcss/graphics/dotoverlay260160.gif">
</td>
-->
</tr></table>

<table style="width: 100%;"><tr>
	<td class="csm-optionrow">
	<form action="https://secure.csse.uwa.edu.au/run/cssubmit?p=np" method="GET">
	Options:	<select name="option" onChange="this.form.submit()">
		<option value="?">Select an option</option>
	<optgroup label="108 deadlines found">
		<option value="l">deadlines listed by unitcode</option>
		<option value="t">pending deadlines</option>
		<option value="c">deadlines listed on a calendar</option>
		<option value="w">deadlines listed week-by-week</option>
	</optgroup>
	</select>
	</form>
	</td>

	<td class="csm-optionrow" style="text-align: left;">
	<form action="https://secure.csse.uwa.edu.au/run/cssubmit?p=np" method="GET">
	Jump to:
	<select name="jumpto2" onChange="this.form.submit()">
	<optgroup label="Information">
		<option value="csentry">csentry</option>
		<option value="csforum">csforum</option>
		<option selected value="cssubmit">cssubmit</option>
		<option value="csmarks">csmarks</option>
		<option value="csbreakdown">csbreakdown</option>
	</optgroup>
	<optgroup label="cshelp - 2nd semester">
		<option value="help1001">help1001&nbsp;&nbsp;&nbsp;software engineering with java</option>
		<option value="help1402">help1402&nbsp;&nbsp;&nbsp;relational database management systems</option>
		<option value="help2002">help2002&nbsp;&nbsp;&nbsp;systems programming</option>
		<option value="help2211">help2211&nbsp;&nbsp;&nbsp;discrete structures</option>
		<option value="help2402">help2402&nbsp;&nbsp;&nbsp;introduction to data science</option>
		<option value="help3001">help3001&nbsp;&nbsp;&nbsp;algorithms, agents, and artificial intelligence</option>
		<option value="help3200">help3200&nbsp;&nbsp;&nbsp;professional computing</option>
		<option value="help4009">help4009&nbsp;&nbsp;&nbsp;computational data analysis</option>
		<option value="help4404">help4404&nbsp;&nbsp;&nbsp;artificial intelligence &amp; adaptive systems</option>
		<option value="help4419">help4419&nbsp;&nbsp;&nbsp;mobile &amp; wireless computing</option>
		<option value="help5502">help5502&nbsp;&nbsp;&nbsp;software processes</option>
		<option value="help5503">help5503&nbsp;&nbsp;&nbsp;cloud computing</option>
		<option value="help5206">help5206&nbsp;&nbsp;&nbsp;professional computing</option>
		<option value="help5507">help5507&nbsp;&nbsp;&nbsp;high performance computing</option>
	</optgroup>
	<optgroup label="cshelp - 1st semester">
		<option value="help1001">help1001&nbsp;&nbsp;&nbsp;software engineering with java</option>
		<option value="help2200">help2200&nbsp;&nbsp;&nbsp;data structures &amp; algorithms</option>
		<option value="help3002">help3002&nbsp;&nbsp;&nbsp;computer networks</option>
		<option value="help3003">help3003&nbsp;&nbsp;&nbsp;graphics &amp; animation</option>
		<option value="help3401">help3401&nbsp;&nbsp;&nbsp;data warehousing</option>
		<option value="help3403">help3403&nbsp;&nbsp;&nbsp;agile web development</option>
		<option value="help4008">help4008&nbsp;&nbsp;&nbsp;scientific communication</option>
		<option value="help4402">help4402&nbsp;&nbsp;&nbsp;computer vision</option>
		<option value="help4401">help4401&nbsp;&nbsp;&nbsp;software requirements &amp; design</option>
		<option value="help4403">help4403&nbsp;&nbsp;&nbsp;computational modelling</option>
		<option value="help4406">help4406&nbsp;&nbsp;&nbsp;problem solving and programming</option>
		<option value="help4407">help4407&nbsp;&nbsp;&nbsp;open source tools &amp; scripting</option>
		<option value="help5501">help5501&nbsp;&nbsp;&nbsp;software testing &amp; quality assurance</option>
		<option value="help5504">help5504&nbsp;&nbsp;&nbsp;data warehousing</option>
		<option value="help5505">help5505&nbsp;&nbsp;&nbsp;agile web development</option>
	</optgroup>
	</select>
	</form>
	</td>
</tr></table>

<table class="thin" style="width: 100%;">
<tr><td class="thin" colspan="3">

<table class="csm-pagebanner">
<tr>
	<td class="csm-pagebannerleft">
	<h3 class="csm-pagebanner">Deadlines of semester 2, 2020</h3>
	</td>
</tr>
</table>

</td></tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS1001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1001-2">SOFTWARE ENGINEERING WITH JAVA</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS1402-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1402-2">RELATIONAL DATABASE MANAGEMENT SYSTEMS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS2002-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2002-2">SYSTEMS PROGRAMMING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS2402-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2402-2">INTRODUCTION TO DATA SCIENCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3001-2">ALGORITHMS, AGENTS AND ARTIFICIAL INTELLIGENCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3200-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3200-2">PROFESSIONAL COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">1.</span>&nbsp;&nbsp;Sprint 1 team deliverables, contributing 5%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">was due at 11:59pm Wed 19th Aug, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">2.</span>&nbsp;&nbsp;Sprint 1 Personal Reflection, contributing 5%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">was due at 11:59pm Fri 21st Aug, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">3.</span>&nbsp;&nbsp;PDP</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">was due at 11:59pm Fri 11th Sep, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">4.</span>&nbsp;&nbsp;Sprint 2 team deliverables, contributing 10%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">was due at 11:59pm Wed 16th Sep, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">5.</span>&nbsp;&nbsp;Sprint 2 Personal Reflection, contributing 5%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">was due at 11:59pm Fri 18th Sep, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">6.</span>&nbsp;&nbsp;Sprint 3 team deliverables, contributing 15%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">was due at 11:59pm Wed 21st Oct, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="background-color: #ede7d3;">&nbsp;</td>
	<td class="thin" style="background-color: #ede7d3;"><span class="span0">7.</span>&nbsp;&nbsp;Sprint 3 Personal Reflection, contributing 5%</td>
	<td class="thin" style="text-align: right; background-color: #ede7d3; width: 20%;"><font color="#666666">was due at 11:59pm Fri 23rd Oct, 2020</font>&nbsp;</td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4001-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4001-2">CSSE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4002-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4002-2">CSSE RESEARCH PROJECT PART 2</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4009-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4009-2">COMPUTATIONAL DATA ANALYSIS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4419-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4419-2">MOBILE AND WIRELESS COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5013-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5013-2">DATA SCIENCE RESEARCH PROJECT PART 3</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5014-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5014-2">DATA SCIENCE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5015-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5015-2">DATA SCIENCE RESEARCH PROJECT PART 2</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5206-2&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5206-2">PROFESSIONAL COMPUTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5507-2&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5507-2">HIGH PERFORMANCE COMPUTING</a></td>
</tr>
<tr><td class="thin" colspan="3">

<table class="csm-pagebanner">
<tr>
	<td class="csm-pagebannerleft">
	<h3 class="csm-pagebanner">Deadlines of semester 1, 2020</h3>
	</td>
</tr>
</table>

</td></tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS1001-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS1001-1">SOFTWARE ENGINEERING WITH JAVA</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS2200-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS2200-1">DATA STRUCTURES AND ALGORITHMS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3002-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3002-1">COMPUTER NETWORKS</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3003-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3003-1">GRAPHICS AND ANIMATION</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS3401-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3401-1">DATA WAREHOUSING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS3403-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS3403-1">AGILE WEB DEVELOPMENT</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4001-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4001-1">CSSE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS4401-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4401-1">SOFTWARE REQUIREMENTS AND DESIGN</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS4407-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS4407-1">OPEN SOURCE TOOLS AND SCRIPTING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5013-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5013-1">DATA SCIENCE RESEARCH PROJECT PART 3</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5014-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5014-1">DATA SCIENCE RESEARCH PROJECT PART 1</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5501-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5501-1">SOFTWARE TESTING AND QUALITY ASSURANCE</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5504-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5504-1">DATA WAREHOUSING</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: white; white-space: nowrap; width: 5%;">CITS5505-1&nbsp;</td>
	<td class="thing" style="background-color: white;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5505-1">AGILE WEB DEVELOPMENT</a></td>
</tr>
<tr>
	<td class="thin" style="text-align: right; background-color: #e4e4e4; white-space: nowrap; width: 5%;">CITS5508-1&nbsp;</td>
	<td class="thing" style="background-color: #e4e4e4;" colspan="2"><a href="https://secure.csse.uwa.edu.au/run/cssubmit?p=np&amp;open=CITS5508-1">MACHINE LEARNING</a></td>
</tr>
</table>

  </td></tr>
</table>

<!-- Begin footer -->

<div id="footercontainer" style="padding-left: 182px;">

    <div class="outerwrapper">
    <div class="sizer">
    <div class="expander">
    <div class="wrapper">

    <div class="footercontent">


<div class="footercol1" id="content_div_199">
<div class="footercol1title">
  The University of Western Australia
</div>

<ul>
<li><a href="https://www.uwa.edu.au/">University Homepage</a></li>
<li><a href="https://www.studyat.uwa.edu.au">Future Students</a></li>
<li><a href="https://www.uwa.edu.au/current">Current Students</a></li>
<li><a href="https://uwa.edu.au/staff">Staff</a></li>
<li><a href="https://uwa.edu.au/business2">Business and industry</a></li>
<li><a href="https://www.development.uwa.edu.au/alumni">Alumni and Friends</a></li>
<li><a href="https://uwa.edu.au/media">Media</a></li>
</ul>
</div>

<!--
<div id="footersitemap" class="footercol">
<strong>Faculty of Engineering, Computing and Mathematics</strong>
<ul>
  <li><a href="https://www.ecm.uwa.edu.au/courses">Courses</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/research">Research</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/alumni">Alumni</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/business">Business and industry</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/community">Community</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/students">Current Students</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/staff">Staff</a></li>
  <li><a href="https://www.ecm.uwa.edu.au/contact">Contact us</a></li>
</ul>
</div>
-->

<div class="footercol" id="content_div_195">
<strong>University information</strong><br>
<acronym title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</acronym> Code: 00126G

<ul>
<li><a href="https://uwa.edu.au/accessibility">Accessibility</a></li>
<li><a href="https://uwa.edu.au/campus_map">Campus map</a></li>
<li><a href="https://uwa.edu.au/contact">Contact the University</a></li>
<li><a href="https://uwa.edu.au/indigenous_commitment">Indigenous Commitment</a></li>
<li><a href="https://uwa.edu.au/terms_of_use">Terms of use</a></li>
</ul>
</div><!-- end .footercol -->

<div class="footercol lastcol">
<strong>This Page</strong><br>
    <p></br>
    Program&nbsp;written&nbsp;by:&nbsp;<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="c784afb5aeb4e98aa483a8a9a6aba387b2b0a6e9a2a3b2e9a6b2">[email&#160;protected]</a><br>
    Feedback&nbsp;welcome<br>
    Last&nbsp;modified:&nbsp;&nbsp;5:11am&nbsp;Oct&nbsp;29&nbsp;2020</p>
<!--
    <p><img style="width: 180px;" src="/images/csmarks15.jpg"></p>
-->
</div><!-- end .footercol .lastcol -->

</div><!-- end .wrapper -->
</div><!-- end .expander -->
</div><!-- end .sizer -->
</div><!-- end .outerwrapper -->
    
</div><!-- end .footercontainer -->		

<!--[if IE]></div></div><![endif]--><!--end #IEroot targeting-->
</div><!--end #bodycontainer-->

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script></body>
</html>
`;