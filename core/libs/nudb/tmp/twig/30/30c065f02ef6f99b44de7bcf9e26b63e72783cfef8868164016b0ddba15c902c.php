<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* javascript/variables.twig */
class __TwigTemplate_cfa35984e365059349cf6d6f594a2362d5d6bc82815347cd43f16f3b50f3378f extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 2
        echo "var firstDayOfCalendar = '";
        echo twig_escape_filter($this->env, ($context["first_day_of_calendar"] ?? null), "js", null, true);
        echo "';
var themeImagePath = '";
        // line 3
        echo twig_escape_filter($this->env, ($context["theme_image_path"] ?? null), "js", null, true);
        echo "';
var mysqlDocTemplate = '";
        // line 4
        echo twig_escape_filter($this->env, PhpMyAdmin\Util::getMySQLDocuURL("%s"), "js", null, true);
        echo "';
var maxInputVars = ";
        // line 5
        echo twig_escape_filter($this->env, ($context["max_input_vars"] ?? null), "js", null, true);
        echo ";

";
        // line 7
        ob_start(function () { return ''; });
        // line 8
        // l10n: Month-year order for calendar, use either "calendar-month-year" or "calendar-year-month".
        echo _gettext("calendar-month-year");
        $context["show_month_after_year"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 10
        ob_start(function () { return ''; });
        // line 11
        // l10n: Year suffix for calendar, "none" is empty.
        echo _gettext("none");
        $context["year_suffix"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 14
        echo "if (\$.datepicker) {
  \$.datepicker.regional[''].closeText = '";
        // line 15
        ob_start(function () { return ''; });
        // l10n: Display text for calendar close link
        echo _gettext("Done");
        $___internal_2cb2a43c604ba6bd2e1ab13bb6de5a118ba6cfdaff21d4dd13f981594739b1df_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_2cb2a43c604ba6bd2e1ab13bb6de5a118ba6cfdaff21d4dd13f981594739b1df_, "js");
        echo "';
  \$.datepicker.regional[''].prevText = '";
        // line 16
        ob_start(function () { return ''; });
        // l10n: Previous month. Display text for previous month link in calendar
        echo _gettext("Prev");
        $___internal_f4a178632452d15bfbb0abd195b794da054e187884cdd3f91b99eec79298e4d4_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_f4a178632452d15bfbb0abd195b794da054e187884cdd3f91b99eec79298e4d4_, "js");
        echo "';
  \$.datepicker.regional[''].nextText = '";
        // line 17
        ob_start(function () { return ''; });
        // l10n: Next month. Display text for next month link in calendar
        echo _gettext("Next");
        $___internal_45519a904bd29cfbe1a96decf5e7dedba1f9b5bdf9bca8ad5353bae06675045e_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_45519a904bd29cfbe1a96decf5e7dedba1f9b5bdf9bca8ad5353bae06675045e_, "js");
        echo "';
  \$.datepicker.regional[''].currentText = '";
        // line 18
        ob_start(function () { return ''; });
        // l10n: Display text for current month link in calendar
        echo _gettext("Today");
        $___internal_a05a614a2934dc272cf53f93289381e04dcb8d09199188c0ce77dc43e1ab70ea_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_a05a614a2934dc272cf53f93289381e04dcb8d09199188c0ce77dc43e1ab70ea_, "js");
        echo "';
  \$.datepicker.regional[''].monthNames = [
    '";
        // line 20
        echo twig_escape_filter($this->env, _gettext("January"), "js", null, true);
        echo "',
    '";
        // line 21
        echo twig_escape_filter($this->env, _gettext("February"), "js", null, true);
        echo "',
    '";
        // line 22
        echo twig_escape_filter($this->env, _gettext("March"), "js", null, true);
        echo "',
    '";
        // line 23
        echo twig_escape_filter($this->env, _gettext("April"), "js", null, true);
        echo "',
    '";
        // line 24
        echo twig_escape_filter($this->env, _gettext("May"), "js", null, true);
        echo "',
    '";
        // line 25
        echo twig_escape_filter($this->env, _gettext("June"), "js", null, true);
        echo "',
    '";
        // line 26
        echo twig_escape_filter($this->env, _gettext("July"), "js", null, true);
        echo "',
    '";
        // line 27
        echo twig_escape_filter($this->env, _gettext("August"), "js", null, true);
        echo "',
    '";
        // line 28
        echo twig_escape_filter($this->env, _gettext("September"), "js", null, true);
        echo "',
    '";
        // line 29
        echo twig_escape_filter($this->env, _gettext("October"), "js", null, true);
        echo "',
    '";
        // line 30
        echo twig_escape_filter($this->env, _gettext("November"), "js", null, true);
        echo "',
    '";
        // line 31
        echo twig_escape_filter($this->env, _gettext("December"), "js", null, true);
        echo "',
  ];
  \$.datepicker.regional[''].monthNamesShort = [
    '";
        // line 34
        ob_start(function () { return ''; });
        // l10n: Short month name for January
        echo _gettext("Jan");
        $___internal_4cc67ebe43a73b54ece5b9c176e87ee86a42861691209a32509fa8ac33343830_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_4cc67ebe43a73b54ece5b9c176e87ee86a42861691209a32509fa8ac33343830_, "js");
        echo "',
    '";
        // line 35
        ob_start(function () { return ''; });
        // l10n: Short month name for February
        echo _gettext("Feb");
        $___internal_659e62aa674a583d67242e27525ff56a36319a1181fb5c91c4cc1c9578dcaad9_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_659e62aa674a583d67242e27525ff56a36319a1181fb5c91c4cc1c9578dcaad9_, "js");
        echo "',
    '";
        // line 36
        ob_start(function () { return ''; });
        // l10n: Short month name for March
        echo _gettext("Mar");
        $___internal_93cec95481d853a7c0d96d97bb324731b9ba8c350a18b51683edfe8dff36caee_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_93cec95481d853a7c0d96d97bb324731b9ba8c350a18b51683edfe8dff36caee_, "js");
        echo "',
    '";
        // line 37
        ob_start(function () { return ''; });
        // l10n: Short month name for April
        echo _gettext("Apr");
        $___internal_e9d4228e293db9fbb1d6c6deeef97789075b4a6aac0cbba07a3427e23f8f5322_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_e9d4228e293db9fbb1d6c6deeef97789075b4a6aac0cbba07a3427e23f8f5322_, "js");
        echo "',
    '";
        // line 38
        ob_start(function () { return ''; });
        // l10n: Short month name for May
        echo _gettext("May");
        $___internal_280039bb0149ead52c1b7739a8bae170420cc12ea21cb7ce68bcc2a62f9d5416_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_280039bb0149ead52c1b7739a8bae170420cc12ea21cb7ce68bcc2a62f9d5416_, "js");
        echo "',
    '";
        // line 39
        ob_start(function () { return ''; });
        // l10n: Short month name for June
        echo _gettext("Jun");
        $___internal_9cc5d552ead2484cc335ebdc69f7c1243e59ec32537ce6a3d99c2d8f1aa97293_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_9cc5d552ead2484cc335ebdc69f7c1243e59ec32537ce6a3d99c2d8f1aa97293_, "js");
        echo "',
    '";
        // line 40
        ob_start(function () { return ''; });
        // l10n: Short month name for July
        echo _gettext("Jul");
        $___internal_32b6ac94d0b8bfd5afded25204c0b9bcbd180125783effc9abca80ee02a349a1_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_32b6ac94d0b8bfd5afded25204c0b9bcbd180125783effc9abca80ee02a349a1_, "js");
        echo "',
    '";
        // line 41
        ob_start(function () { return ''; });
        // l10n: Short month name for August
        echo _gettext("Aug");
        $___internal_33044060ade7ffe1711020e0ed173b064bc97f3a4476d4a707da39b1d8136b1d_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_33044060ade7ffe1711020e0ed173b064bc97f3a4476d4a707da39b1d8136b1d_, "js");
        echo "',
    '";
        // line 42
        ob_start(function () { return ''; });
        // l10n: Short month name for September
        echo _gettext("Sep");
        $___internal_0f3a9ad652ab4d11a2036dfd30cfd3e966730a48c1588ce540f5d418a560edc6_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_0f3a9ad652ab4d11a2036dfd30cfd3e966730a48c1588ce540f5d418a560edc6_, "js");
        echo "',
    '";
        // line 43
        ob_start(function () { return ''; });
        // l10n: Short month name for October
        echo _gettext("Oct");
        $___internal_60332fc4b8adae73d68d176f86b4fbbf206ee29ba9ddbfef53ad1534d91212ea_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_60332fc4b8adae73d68d176f86b4fbbf206ee29ba9ddbfef53ad1534d91212ea_, "js");
        echo "',
    '";
        // line 44
        ob_start(function () { return ''; });
        // l10n: Short month name for November
        echo _gettext("Nov");
        $___internal_4c0611242cd2a59e7ebcf50721ca8a52f0776a9fc2235edb84759cbf1be77306_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_4c0611242cd2a59e7ebcf50721ca8a52f0776a9fc2235edb84759cbf1be77306_, "js");
        echo "',
    '";
        // line 45
        ob_start(function () { return ''; });
        // l10n: Short month name for December
        echo _gettext("Dec");
        $___internal_f43de55002b6241d16b6c3cf4f5db674a919ee8a1b7272d1202bdb7215de21c3_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_f43de55002b6241d16b6c3cf4f5db674a919ee8a1b7272d1202bdb7215de21c3_, "js");
        echo "',
  ];
  \$.datepicker.regional[''].dayNames = [
    '";
        // line 48
        echo twig_escape_filter($this->env, _gettext("Sunday"), "js", null, true);
        echo "',
    '";
        // line 49
        echo twig_escape_filter($this->env, _gettext("Monday"), "js", null, true);
        echo "',
    '";
        // line 50
        echo twig_escape_filter($this->env, _gettext("Tuesday"), "js", null, true);
        echo "',
    '";
        // line 51
        echo twig_escape_filter($this->env, _gettext("Wednesday"), "js", null, true);
        echo "',
    '";
        // line 52
        echo twig_escape_filter($this->env, _gettext("Thursday"), "js", null, true);
        echo "',
    '";
        // line 53
        echo twig_escape_filter($this->env, _gettext("Friday"), "js", null, true);
        echo "',
    '";
        // line 54
        echo twig_escape_filter($this->env, _gettext("Saturday"), "js", null, true);
        echo "',
  ];
  \$.datepicker.regional[''].dayNamesShort = [
    '";
        // line 57
        ob_start(function () { return ''; });
        // l10n: Short week day name for Sunday
        echo _gettext("Sun");
        $___internal_cb407728e5e0f95269640980fdfc82e2edd1a664e0eda0ca31fae4c509c03cd1_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_cb407728e5e0f95269640980fdfc82e2edd1a664e0eda0ca31fae4c509c03cd1_, "js");
        echo "',
    '";
        // line 58
        ob_start(function () { return ''; });
        // l10n: Short week day name for Monday
        echo _gettext("Mon");
        $___internal_f56bf3e202ab5373689a98611a954df1d25b5da70c7309015334c025f57e98fa_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_f56bf3e202ab5373689a98611a954df1d25b5da70c7309015334c025f57e98fa_, "js");
        echo "',
    '";
        // line 59
        ob_start(function () { return ''; });
        // l10n: Short week day name for Tuesday
        echo _gettext("Tue");
        $___internal_ffb08b9991306e9c903a78828167fbe6992047370a8e8c74483a4b6fa343b949_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_ffb08b9991306e9c903a78828167fbe6992047370a8e8c74483a4b6fa343b949_, "js");
        echo "',
    '";
        // line 60
        ob_start(function () { return ''; });
        // l10n: Short week day name for Wednesday
        echo _gettext("Wed");
        $___internal_d3870ced0e342c5bc0af87d8a99babe691ca5b17bf17efe0e4633cdb7588a79d_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_d3870ced0e342c5bc0af87d8a99babe691ca5b17bf17efe0e4633cdb7588a79d_, "js");
        echo "',
    '";
        // line 61
        ob_start(function () { return ''; });
        // l10n: Short week day name for Thursday
        echo _gettext("Thu");
        $___internal_a545624cc7e6468ee92b59ceb8bdb6d7629db6b8c3ce694adf5bf13d1f14493f_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_a545624cc7e6468ee92b59ceb8bdb6d7629db6b8c3ce694adf5bf13d1f14493f_, "js");
        echo "',
    '";
        // line 62
        ob_start(function () { return ''; });
        // l10n: Short week day name for Friday
        echo _gettext("Fri");
        $___internal_00990ed5251b7ede748b4382b7b39c01e99b0896ba89cc5399eb643b42a0533b_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_00990ed5251b7ede748b4382b7b39c01e99b0896ba89cc5399eb643b42a0533b_, "js");
        echo "',
    '";
        // line 63
        ob_start(function () { return ''; });
        // l10n: Short week day name for Saturday
        echo _gettext("Sat");
        $___internal_58894acd0dcf41925451309fd28d1901fd5697df6cca2bd962682414fd2463d4_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_58894acd0dcf41925451309fd28d1901fd5697df6cca2bd962682414fd2463d4_, "js");
        echo "',
  ];
  \$.datepicker.regional[''].dayNamesMin = [
    '";
        // line 66
        ob_start(function () { return ''; });
        // l10n: Minimal week day name for Sunday
        echo _gettext("Su");
        $___internal_59edd46f389e849f2b995843be528fc964c902abc05b6bb77f44fb53142c8f70_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_59edd46f389e849f2b995843be528fc964c902abc05b6bb77f44fb53142c8f70_, "js");
        echo "',
    '";
        // line 67
        ob_start(function () { return ''; });
        // l10n: Minimal week day name for Monday
        echo _gettext("Mo");
        $___internal_d97c393b20b3f79bf14781f241dfb0eb6a7a608ada38b003c52a8d0975cfba5b_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_d97c393b20b3f79bf14781f241dfb0eb6a7a608ada38b003c52a8d0975cfba5b_, "js");
        echo "',
    '";
        // line 68
        ob_start(function () { return ''; });
        // l10n: Minimal week day name for Tuesday
        echo _gettext("Tu");
        $___internal_b5df15c542bc7fc2008f8fff8377d880134198d8fb267bc45933df5dba8755fe_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_b5df15c542bc7fc2008f8fff8377d880134198d8fb267bc45933df5dba8755fe_, "js");
        echo "',
    '";
        // line 69
        ob_start(function () { return ''; });
        // l10n: Minimal week day name for Wednesday
        echo _gettext("We");
        $___internal_da21fa78fedc98e6bd4526d398f30f92a817637ae037e3302e33d2ac0a7bd3d2_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_da21fa78fedc98e6bd4526d398f30f92a817637ae037e3302e33d2ac0a7bd3d2_, "js");
        echo "',
    '";
        // line 70
        ob_start(function () { return ''; });
        // l10n: Minimal week day name for Thursday
        echo _gettext("Th");
        $___internal_f26c2d156a7ae6b0ac72fa4d42e207c5cbc2af19a6d998f7ee2f6843deded9cd_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_f26c2d156a7ae6b0ac72fa4d42e207c5cbc2af19a6d998f7ee2f6843deded9cd_, "js");
        echo "',
    '";
        // line 71
        ob_start(function () { return ''; });
        // l10n: Minimal week day name for Friday
        echo _gettext("Fr");
        $___internal_5759a46239b532c5f0c417b2be8a1f9e497f095e5ec38decc3ccb953effe3a12_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_5759a46239b532c5f0c417b2be8a1f9e497f095e5ec38decc3ccb953effe3a12_, "js");
        echo "',
    '";
        // line 72
        ob_start(function () { return ''; });
        // l10n: Minimal week day name for Saturday
        echo _gettext("Sa");
        $___internal_06fe768daed46f0f2cbe843411b5e53a64a6e783d0fe8e5e5c5490a8e28648d1_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_06fe768daed46f0f2cbe843411b5e53a64a6e783d0fe8e5e5c5490a8e28648d1_, "js");
        echo "',
  ];
  \$.datepicker.regional[''].weekHeader = '";
        // line 74
        ob_start(function () { return ''; });
        // l10n: Column header for week of the year in calendar
        echo _gettext("Wk");
        $___internal_b1d14cb4e7e7907560468d3414993671969549c680c4e059273bc37d39694e4a_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_b1d14cb4e7e7907560468d3414993671969549c680c4e059273bc37d39694e4a_, "js");
        echo "';
  \$.datepicker.regional[''].showMonthAfterYear = ";
        // line 75
        echo (((($context["show_month_after_year"] ?? null) == "calendar-year-month")) ? ("true") : ("false"));
        echo ";
  \$.datepicker.regional[''].yearSuffix = '";
        // line 76
        echo (((($context["year_suffix"] ?? null) != "none")) ? (twig_escape_filter($this->env, ($context["year_suffix"] ?? null), "js")) : (""));
        echo "';
  \$.extend(\$.datepicker._defaults, \$.datepicker.regional['']);
}

if (\$.timepicker) {
  \$.timepicker.regional[''].timeText = '";
        // line 81
        echo twig_escape_filter($this->env, _gettext("Time"), "js", null, true);
        echo "';
  \$.timepicker.regional[''].hourText = '";
        // line 82
        echo twig_escape_filter($this->env, _gettext("Hour"), "js", null, true);
        echo "';
  \$.timepicker.regional[''].minuteText = '";
        // line 83
        echo twig_escape_filter($this->env, _gettext("Minute"), "js", null, true);
        echo "';
  \$.timepicker.regional[''].secondText = '";
        // line 84
        echo twig_escape_filter($this->env, _gettext("Second"), "js", null, true);
        echo "';
  \$.extend(\$.timepicker._defaults, \$.timepicker.regional['']);
}

function extendingValidatorMessages () {
  \$.extend(\$.validator.messages, {
    required: '";
        // line 90
        echo twig_escape_filter($this->env, _gettext("This field is required"), "js", null, true);
        echo "',
    remote: '";
        // line 91
        echo twig_escape_filter($this->env, _gettext("Please fix this field"), "js", null, true);
        echo "',
    email: '";
        // line 92
        echo twig_escape_filter($this->env, _gettext("Please enter a valid email address"), "js", null, true);
        echo "',
    url: '";
        // line 93
        echo twig_escape_filter($this->env, _gettext("Please enter a valid URL"), "js", null, true);
        echo "',
    date: '";
        // line 94
        echo twig_escape_filter($this->env, _gettext("Please enter a valid date"), "js", null, true);
        echo "',
    dateISO: '";
        // line 95
        echo twig_escape_filter($this->env, _gettext("Please enter a valid date ( ISO )"), "js", null, true);
        echo "',
    number: '";
        // line 96
        echo twig_escape_filter($this->env, _gettext("Please enter a valid number"), "js", null, true);
        echo "',
    creditcard: '";
        // line 97
        echo twig_escape_filter($this->env, _gettext("Please enter a valid credit card number"), "js", null, true);
        echo "',
    digits: '";
        // line 98
        echo twig_escape_filter($this->env, _gettext("Please enter only digits"), "js", null, true);
        echo "',
    equalTo: '";
        // line 99
        echo twig_escape_filter($this->env, _gettext("Please enter the same value again"), "js", null, true);
        echo "',
    maxlength: \$.validator.format('";
        // line 100
        echo twig_escape_filter($this->env, _gettext("Please enter no more than {0} characters"), "js", null, true);
        echo "'),
    minlength: \$.validator.format('";
        // line 101
        echo twig_escape_filter($this->env, _gettext("Please enter at least {0} characters"), "js", null, true);
        echo "'),
    rangelength: \$.validator.format('";
        // line 102
        echo twig_escape_filter($this->env, _gettext("Please enter a value between {0} and {1} characters long"), "js", null, true);
        echo "'),
    range: \$.validator.format('";
        // line 103
        echo twig_escape_filter($this->env, _gettext("Please enter a value between {0} and {1}"), "js", null, true);
        echo "'),
    max: \$.validator.format('";
        // line 104
        echo twig_escape_filter($this->env, _gettext("Please enter a value less than or equal to {0}"), "js", null, true);
        echo "'),
    min: \$.validator.format('";
        // line 105
        echo twig_escape_filter($this->env, _gettext("Please enter a value greater than or equal to {0}"), "js", null, true);
        echo "'),
    validationFunctionForDateTime: \$.validator.format('";
        // line 106
        echo twig_escape_filter($this->env, _gettext("Please enter a valid date or time"), "js", null, true);
        echo "'),
    validationFunctionForHex: \$.validator.format('";
        // line 107
        echo twig_escape_filter($this->env, _gettext("Please enter a valid HEX input"), "js", null, true);
        echo "'),
    validationFunctionForMd5: \$.validator.format('";
        // line 108
        ob_start(function () { return ''; });
        // l10n: To validate the usage of a MD5 function on the column
        echo _gettext("This column can not contain a 32 chars value");
        $___internal_c0d3372e269e0574503a2f41d9da9ee46c20155301118077a7761b437d8bd1d2_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_c0d3372e269e0574503a2f41d9da9ee46c20155301118077a7761b437d8bd1d2_, "js");
        echo "'),
    validationFunctionForAesDesEncrypt: \$.validator.format('";
        // line 109
        ob_start(function () { return ''; });
        // l10n: To validate the usage of a AES_ENCRYPT/DES_ENCRYPT function on the column
        echo _gettext("These functions are meant to return a binary result; to avoid inconsistent results you should store it in a BINARY, VARBINARY, or BLOB column.");
        $___internal_ef3d837e185e25a43b70a732f3186f4bbccedc44e2395e89a5dc32eba87c1325_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        echo twig_escape_filter($this->env, $___internal_ef3d837e185e25a43b70a732f3186f4bbccedc44e2395e89a5dc32eba87c1325_, "js");
        echo "')
  });
}
";
    }

    public function getTemplateName()
    {
        return "javascript/variables.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  517 => 109,  509 => 108,  505 => 107,  501 => 106,  497 => 105,  493 => 104,  489 => 103,  485 => 102,  481 => 101,  477 => 100,  473 => 99,  469 => 98,  465 => 97,  461 => 96,  457 => 95,  453 => 94,  449 => 93,  445 => 92,  441 => 91,  437 => 90,  428 => 84,  424 => 83,  420 => 82,  416 => 81,  408 => 76,  404 => 75,  396 => 74,  387 => 72,  379 => 71,  371 => 70,  363 => 69,  355 => 68,  347 => 67,  339 => 66,  329 => 63,  321 => 62,  313 => 61,  305 => 60,  297 => 59,  289 => 58,  281 => 57,  275 => 54,  271 => 53,  267 => 52,  263 => 51,  259 => 50,  255 => 49,  251 => 48,  241 => 45,  233 => 44,  225 => 43,  217 => 42,  209 => 41,  201 => 40,  193 => 39,  185 => 38,  177 => 37,  169 => 36,  161 => 35,  153 => 34,  147 => 31,  143 => 30,  139 => 29,  135 => 28,  131 => 27,  127 => 26,  123 => 25,  119 => 24,  115 => 23,  111 => 22,  107 => 21,  103 => 20,  94 => 18,  86 => 17,  78 => 16,  70 => 15,  67 => 14,  63 => 11,  61 => 10,  57 => 8,  55 => 7,  50 => 5,  46 => 4,  42 => 3,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("", "javascript/variables.twig", "C:\\xampp\\htdocs\\nubuilder4\\core\\libs\\nudb\\templates\\javascript\\variables.twig");
    }
}
