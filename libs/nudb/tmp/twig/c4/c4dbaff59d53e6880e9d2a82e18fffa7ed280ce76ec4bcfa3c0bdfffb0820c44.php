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

/* table/structure/display_structure.twig */
class __TwigTemplate_1c5cad90e2e5f68257bce8aa298000aff96f0be8748e97501ed13a58e11f8e0a extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'content' => [$this, 'block_content'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "table/page_with_secondary_tabs.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $this->parent = $this->loadTemplate("table/page_with_secondary_tabs.twig", "table/structure/display_structure.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 2
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 3
        echo "<form method=\"post\" action=\"tbl_structure.php\" name=\"fieldsForm\" id=\"fieldsForm\"
    class=\"ajax";
        // line 4
        echo ((($context["hide_structure_actions"] ?? null)) ? (" HideStructureActions") : (""));
        echo "\">
    ";
        // line 5
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
        echo "
    <input type=\"hidden\" name=\"table_type\" value=";
        // line 7
        if (($context["db_is_system_schema"] ?? null)) {
            // line 8
            echo "\"information_schema\"";
        } elseif (        // line 9
($context["tbl_is_view"] ?? null)) {
            // line 10
            echo "\"view\"";
        } else {
            // line 12
            echo "\"table\"";
        }
        // line 13
        echo ">
    <div class=\"responsivetable\">
    <table id=\"tablestructure\" class=\"data topmargin\">
        ";
        // line 17
        echo "        <thead>
            <tr>
                <th class=\"print_ignore\"></th>
                <th>#</th>
                <th>";
        // line 21
        echo _gettext("Name");
        echo "</th>
                <th>";
        // line 22
        echo _gettext("Type");
        echo "</th>
                <th>";
        // line 23
        echo _gettext("Collation");
        echo "</th>
                <th>";
        // line 24
        echo _gettext("Attributes");
        echo "</th>
                <th>";
        // line 25
        echo _gettext("Null");
        echo "</th>
                <th>";
        // line 26
        echo _gettext("Default");
        echo "</th>
                ";
        // line 27
        if (($context["show_column_comments"] ?? null)) {
            // line 28
            echo "<th>";
            echo _gettext("Comments");
            echo "</th>";
        }
        // line 30
        echo "                <th>";
        echo _gettext("Extra");
        echo "</th>
                ";
        // line 32
        echo "                ";
        if (( !($context["db_is_system_schema"] ?? null) &&  !($context["tbl_is_view"] ?? null))) {
            // line 33
            echo "                    <th colspan=\"";
            echo ((PhpMyAdmin\Util::showIcons("ActionLinksMode")) ? ("8") : ("9"));
            // line 34
            echo "\" class=\"action print_ignore\">";
            echo _gettext("Action");
            echo "</th>
                ";
        }
        // line 36
        echo "            </tr>
        </thead>
        <tbody>
        ";
        // line 40
        echo "        ";
        $context["rownum"] = 0;
        // line 41
        echo "        ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["fields"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["row"]) {
            // line 42
            echo "            ";
            $context["rownum"] = (($context["rownum"] ?? null) + 1);
            // line 43
            echo "
            ";
            // line 44
            $context["extracted_columnspec"] = (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["extracted_columnspecs"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4[($context["rownum"] ?? null)] ?? null) : null);
            // line 45
            echo "            ";
            $context["field_name"] = twig_escape_filter($this->env, (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = $context["row"]) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144["Field"] ?? null) : null));
            // line 46
            echo "            ";
            // line 47
            echo "            ";
            $context["comments"] = (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = ($context["row_comments"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b[($context["rownum"] ?? null)] ?? null) : null);
            // line 48
            echo "            ";
            // line 49
            echo "
        <tr>
            <td class=\"center print_ignore\">
                <input type=\"checkbox\" class=\"checkall\" name=\"selected_fld[]\" value=\"";
            // line 52
            echo twig_escape_filter($this->env, (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = $context["row"]) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002["Field"] ?? null) : null), "html", null, true);
            echo "\" id=\"checkbox_row_";
            echo twig_escape_filter($this->env, ($context["rownum"] ?? null), "html", null, true);
            echo "\">
            </td>
            <td class=\"right\">";
            // line 54
            echo twig_escape_filter($this->env, ($context["rownum"] ?? null), "html", null, true);
            echo "</td>
            <th class=\"nowrap\">
                <label for=\"checkbox_row_";
            // line 56
            echo twig_escape_filter($this->env, ($context["rownum"] ?? null), "html", null, true);
            echo "\">
                    ";
            // line 57
            if (twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, ($context["displayed_fields"] ?? null), ($context["rownum"] ?? null), [], "array", false, true, false, 57), "comment", [], "any", true, true, false, 57)) {
                // line 58
                echo "                        <span class=\"commented_column\" title=\"";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, (($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 = ($context["displayed_fields"] ?? null)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4[($context["rownum"] ?? null)] ?? null) : null), "comment", [], "any", false, false, false, 58), "html", null, true);
                echo "\">";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, (($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 = ($context["displayed_fields"] ?? null)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666[($context["rownum"] ?? null)] ?? null) : null), "text", [], "any", false, false, false, 58), "html", null, true);
                echo "</span>
                    ";
            } else {
                // line 60
                echo "                        ";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, (($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e = ($context["displayed_fields"] ?? null)) && is_array($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e) || $__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e instanceof ArrayAccess ? ($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e[($context["rownum"] ?? null)] ?? null) : null), "text", [], "any", false, false, false, 60), "html", null, true);
                echo "
                    ";
            }
            // line 62
            echo "                    ";
            echo twig_get_attribute($this->env, $this->source, (($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 = ($context["displayed_fields"] ?? null)) && is_array($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52) || $__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 instanceof ArrayAccess ? ($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52[($context["rownum"] ?? null)] ?? null) : null), "icon", [], "any", false, false, false, 62);
            echo "
                </label>
            </th>
            <td";
            // line 65
            echo (((("set" != (($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 = ($context["extracted_columnspec"] ?? null)) && is_array($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136) || $__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 instanceof ArrayAccess ? ($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136["type"] ?? null) : null)) && ("enum" != (($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386 = ($context["extracted_columnspec"] ?? null)) && is_array($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386) || $__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386 instanceof ArrayAccess ? ($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386["type"] ?? null) : null)))) ? (" class=\"nowrap\"") : (""));
            echo ">
                <bdo dir=\"ltr\" lang=\"en\">
                    ";
            // line 67
            echo (($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 = ($context["extracted_columnspec"] ?? null)) && is_array($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9) || $__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 instanceof ArrayAccess ? ($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9["displayed_type"] ?? null) : null);
            echo "
                    ";
            // line 68
            if ((((($context["relation_commwork"] ?? null) && ($context["relation_mimework"] ?? null)) && ($context["browse_mime"] ?? null)) && twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source,             // line 69
($context["mime_map"] ?? null), (($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae = $context["row"]) && is_array($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae) || $__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae instanceof ArrayAccess ? ($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae["Field"] ?? null) : null), [], "array", false, true, false, 69), "mimetype", [], "array", true, true, false, 69))) {
                // line 70
                echo "                        <br>";
                echo _gettext("Media (MIME) type:");
                echo " ";
                echo twig_escape_filter($this->env, twig_lower_filter($this->env, twig_replace_filter((($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f = (($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40 = ($context["mime_map"] ?? null)) && is_array($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40) || $__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40 instanceof ArrayAccess ? ($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40[(($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f = $context["row"]) && is_array($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f) || $__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f instanceof ArrayAccess ? ($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f["Field"] ?? null) : null)] ?? null) : null)) && is_array($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f) || $__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f instanceof ArrayAccess ? ($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f["mimetype"] ?? null) : null), ["_" => "/"])), "html", null, true);
                echo "
                    ";
            }
            // line 72
            echo "                </bdo>
            </td>
            <td>
            ";
            // line 75
            if ( !twig_test_empty((($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 = $context["row"]) && is_array($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760) || $__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 instanceof ArrayAccess ? ($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760["Collation"] ?? null) : null))) {
                // line 76
                echo "                <dfn title=\"";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, (($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce = ($context["collations"] ?? null)) && is_array($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce) || $__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce instanceof ArrayAccess ? ($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce[(($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b = $context["row"]) && is_array($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b) || $__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b instanceof ArrayAccess ? ($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b["Collation"] ?? null) : null)] ?? null) : null), "description", [], "any", false, false, false, 76), "html", null, true);
                echo "\">";
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, (($__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c = ($context["collations"] ?? null)) && is_array($__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c) || $__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c instanceof ArrayAccess ? ($__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c[(($__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972 = $context["row"]) && is_array($__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972) || $__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972 instanceof ArrayAccess ? ($__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972["Collation"] ?? null) : null)] ?? null) : null), "name", [], "any", false, false, false, 76), "html", null, true);
                echo "</dfn>
            ";
            }
            // line 78
            echo "            </td>
            <td class=\"column_attribute nowrap\">";
            // line 79
            echo twig_escape_filter($this->env, (($__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216 = ($context["attributes"] ?? null)) && is_array($__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216) || $__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216 instanceof ArrayAccess ? ($__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216[($context["rownum"] ?? null)] ?? null) : null), "html", null, true);
            echo "</td>
            <td>";
            // line 80
            echo twig_escape_filter($this->env, ((((($__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0 = $context["row"]) && is_array($__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0) || $__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0 instanceof ArrayAccess ? ($__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0["Null"] ?? null) : null) == "YES")) ? (_gettext("Yes")) : (_gettext("No"))), "html", null, true);
            echo "</td>
            <td class=\"nowrap\">
                ";
            // line 82
            if ( !(null === (($__internal_674c0abf302105af78b0a38907d86c5dd0028bdc3ee5f24bf52771a16487760c = $context["row"]) && is_array($__internal_674c0abf302105af78b0a38907d86c5dd0028bdc3ee5f24bf52771a16487760c) || $__internal_674c0abf302105af78b0a38907d86c5dd0028bdc3ee5f24bf52771a16487760c instanceof ArrayAccess ? ($__internal_674c0abf302105af78b0a38907d86c5dd0028bdc3ee5f24bf52771a16487760c["Default"] ?? null) : null))) {
                // line 83
                echo "                    ";
                if (((($__internal_dd839fbfcab68823c49af471c7df7659a500fe72e71b58d6b80d896bdb55e75f = ($context["extracted_columnspec"] ?? null)) && is_array($__internal_dd839fbfcab68823c49af471c7df7659a500fe72e71b58d6b80d896bdb55e75f) || $__internal_dd839fbfcab68823c49af471c7df7659a500fe72e71b58d6b80d896bdb55e75f instanceof ArrayAccess ? ($__internal_dd839fbfcab68823c49af471c7df7659a500fe72e71b58d6b80d896bdb55e75f["type"] ?? null) : null) == "bit")) {
                    // line 84
                    echo "                        ";
                    echo twig_escape_filter($this->env, PhpMyAdmin\Util::convertBitDefaultValue((($__internal_a7ed47878554bdc32b70e1ba5ccc67d2302196876fbf62b4c853b20cb9e029fc = $context["row"]) && is_array($__internal_a7ed47878554bdc32b70e1ba5ccc67d2302196876fbf62b4c853b20cb9e029fc) || $__internal_a7ed47878554bdc32b70e1ba5ccc67d2302196876fbf62b4c853b20cb9e029fc instanceof ArrayAccess ? ($__internal_a7ed47878554bdc32b70e1ba5ccc67d2302196876fbf62b4c853b20cb9e029fc["Default"] ?? null) : null)), "html", null, true);
                    echo "
                    ";
                } else {
                    // line 86
                    echo "                        ";
                    echo twig_escape_filter($this->env, (($__internal_e5d7b41e16b744b68da1e9bb49047b8028ced86c782900009b4b4029b83d4b55 = $context["row"]) && is_array($__internal_e5d7b41e16b744b68da1e9bb49047b8028ced86c782900009b4b4029b83d4b55) || $__internal_e5d7b41e16b744b68da1e9bb49047b8028ced86c782900009b4b4029b83d4b55 instanceof ArrayAccess ? ($__internal_e5d7b41e16b744b68da1e9bb49047b8028ced86c782900009b4b4029b83d4b55["Default"] ?? null) : null), "html", null, true);
                    echo "
                    ";
                }
                // line 88
                echo "                ";
            } elseif (((($__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba = $context["row"]) && is_array($__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba) || $__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba instanceof ArrayAccess ? ($__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba["Null"] ?? null) : null) == "YES")) {
                // line 89
                echo "                    <em>NULL</em>
                ";
            } else {
                // line 91
                echo "                    <em>";
                echo _pgettext(                "None for default", "None");
                echo "</em>
                ";
            }
            // line 93
            echo "            </td>
            ";
            // line 94
            if (($context["show_column_comments"] ?? null)) {
                // line 95
                echo "                <td>
                    ";
                // line 96
                echo twig_escape_filter($this->env, ($context["comments"] ?? null), "html", null, true);
                echo "
                </td>
            ";
            }
            // line 99
            echo "            <td class=\"nowrap\">";
            echo twig_escape_filter($this->env, twig_upper_filter($this->env, (($__internal_0795e3de58b6454b051261c0c2b5be48852e17f25b59d4aeef29fb07c614bd78 = $context["row"]) && is_array($__internal_0795e3de58b6454b051261c0c2b5be48852e17f25b59d4aeef29fb07c614bd78) || $__internal_0795e3de58b6454b051261c0c2b5be48852e17f25b59d4aeef29fb07c614bd78 instanceof ArrayAccess ? ($__internal_0795e3de58b6454b051261c0c2b5be48852e17f25b59d4aeef29fb07c614bd78["Extra"] ?? null) : null)), "html", null, true);
            echo "</td>
            ";
            // line 100
            if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
                // line 101
                echo "                <td class=\"edit center print_ignore\">
                    <a class=\"change_column_anchor ajax\" href=\"tbl_structure.php";
                // line 103
                echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
                echo "&amp;field=";
                echo twig_escape_filter($this->env, twig_urlencode_filter((($__internal_fecb0565c93d0b979a95c352ff76e401e0ae0c73bb8d3b443c8c6133e1c190de = $context["row"]) && is_array($__internal_fecb0565c93d0b979a95c352ff76e401e0ae0c73bb8d3b443c8c6133e1c190de) || $__internal_fecb0565c93d0b979a95c352ff76e401e0ae0c73bb8d3b443c8c6133e1c190de instanceof ArrayAccess ? ($__internal_fecb0565c93d0b979a95c352ff76e401e0ae0c73bb8d3b443c8c6133e1c190de["Field"] ?? null) : null)), "html", null, true);
                echo "&amp;change_column=1\">
                        ";
                // line 104
                echo (($__internal_87570a635eac7f6e150744bd218085d17aff15d92d9c80a66d3b911e3355b828 = ($context["titles"] ?? null)) && is_array($__internal_87570a635eac7f6e150744bd218085d17aff15d92d9c80a66d3b911e3355b828) || $__internal_87570a635eac7f6e150744bd218085d17aff15d92d9c80a66d3b911e3355b828 instanceof ArrayAccess ? ($__internal_87570a635eac7f6e150744bd218085d17aff15d92d9c80a66d3b911e3355b828["Change"] ?? null) : null);
                echo "
                    </a>
                </td>
                <td class=\"drop center print_ignore\">
                    <a class=\"drop_column_anchor ajax\" href=\"sql.php\" data-post=\"";
                // line 108
                echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
                echo "&amp;sql_query=";
                // line 109
                echo twig_escape_filter($this->env, twig_urlencode_filter((((("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " DROP ") . PhpMyAdmin\Util::backquote((($__internal_17b5b5f9aaeec4b528bfeed02b71f624021d6a52d927f441de2f2204d0e527cd =                 // line 110
$context["row"]) && is_array($__internal_17b5b5f9aaeec4b528bfeed02b71f624021d6a52d927f441de2f2204d0e527cd) || $__internal_17b5b5f9aaeec4b528bfeed02b71f624021d6a52d927f441de2f2204d0e527cd instanceof ArrayAccess ? ($__internal_17b5b5f9aaeec4b528bfeed02b71f624021d6a52d927f441de2f2204d0e527cd["Field"] ?? null) : null))) . ";")), "html", null, true);
                // line 111
                echo "&amp;dropped_column=";
                echo twig_escape_filter($this->env, twig_urlencode_filter((($__internal_0db9a23306660395861a0528381e0668025e56a8a99f399e9ec23a4b392422d6 = $context["row"]) && is_array($__internal_0db9a23306660395861a0528381e0668025e56a8a99f399e9ec23a4b392422d6) || $__internal_0db9a23306660395861a0528381e0668025e56a8a99f399e9ec23a4b392422d6 instanceof ArrayAccess ? ($__internal_0db9a23306660395861a0528381e0668025e56a8a99f399e9ec23a4b392422d6["Field"] ?? null) : null)), "html", null, true);
                echo "&amp;purge=1&amp;message_to_show=";
                // line 112
                echo twig_escape_filter($this->env, twig_urlencode_filter(sprintf(_gettext("Column %s has been dropped."), twig_escape_filter($this->env, (($__internal_0a23ad2f11a348e49c87410947e20d5a4e711234ce49927662da5dddac687855 = $context["row"]) && is_array($__internal_0a23ad2f11a348e49c87410947e20d5a4e711234ce49927662da5dddac687855) || $__internal_0a23ad2f11a348e49c87410947e20d5a4e711234ce49927662da5dddac687855 instanceof ArrayAccess ? ($__internal_0a23ad2f11a348e49c87410947e20d5a4e711234ce49927662da5dddac687855["Field"] ?? null) : null)))), "html", null, true);
                echo "\">
                        ";
                // line 113
                echo (($__internal_0228c5445a74540c89ea8a758478d405796357800f8af831a7f7e1e2c0159d9b = ($context["titles"] ?? null)) && is_array($__internal_0228c5445a74540c89ea8a758478d405796357800f8af831a7f7e1e2c0159d9b) || $__internal_0228c5445a74540c89ea8a758478d405796357800f8af831a7f7e1e2c0159d9b instanceof ArrayAccess ? ($__internal_0228c5445a74540c89ea8a758478d405796357800f8af831a7f7e1e2c0159d9b["Drop"] ?? null) : null);
                echo "
                    </a>
                </td>
            ";
            }
            // line 117
            echo "
            ";
            // line 118
            if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
                // line 119
                echo "                ";
                $context["type"] = (( !twig_test_empty((($__internal_6fb04c4457ec9ffa7dd6fd2300542be8b961b6e5f7858a80a282f47b43ddae5f = ($context["extracted_columnspec"] ?? null)) && is_array($__internal_6fb04c4457ec9ffa7dd6fd2300542be8b961b6e5f7858a80a282f47b43ddae5f) || $__internal_6fb04c4457ec9ffa7dd6fd2300542be8b961b6e5f7858a80a282f47b43ddae5f instanceof ArrayAccess ? ($__internal_6fb04c4457ec9ffa7dd6fd2300542be8b961b6e5f7858a80a282f47b43ddae5f["print_type"] ?? null) : null))) ? ((($__internal_417a1a95b289c75779f33186a6dc0b71d01f257b68beae7dcb9d2d769acca0e0 = ($context["extracted_columnspec"] ?? null)) && is_array($__internal_417a1a95b289c75779f33186a6dc0b71d01f257b68beae7dcb9d2d769acca0e0) || $__internal_417a1a95b289c75779f33186a6dc0b71d01f257b68beae7dcb9d2d769acca0e0 instanceof ArrayAccess ? ($__internal_417a1a95b289c75779f33186a6dc0b71d01f257b68beae7dcb9d2d769acca0e0["print_type"] ?? null) : null)) : (""));
                // line 120
                echo "                <td class=\"print_ignore\">
                    <ul class=\"table-structure-actions resizable-menu\">
                        ";
                // line 122
                if (($context["hide_structure_actions"] ?? null)) {
                    // line 123
                    echo "                            <li class=\"submenu shown\">
                                <a href=\"#\" class=\"tab nowrap\">";
                    // line 124
                    echo PhpMyAdmin\Util::getIcon("b_more", _gettext("More"));
                    echo "</a>
                                <ul>
                        ";
                }
                // line 127
                echo "                        ";
                // line 128
                echo "                        ";
                $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/display_structure.twig", 128)->display(twig_to_array(["type" =>                 // line 129
($context["type"] ?? null), "tbl_storage_engine" =>                 // line 130
($context["tbl_storage_engine"] ?? null), "class" => "primary nowrap", "has_field" => (                // line 132
($context["primary"] ?? null) && twig_get_attribute($this->env, $this->source, ($context["primary"] ?? null), "hasColumn", [0 => ($context["field_name"] ?? null)], "method", false, false, false, 132)), "has_link_class" => true, "url_query" =>                 // line 134
($context["url_query"] ?? null), "primary" =>                 // line 135
($context["primary"] ?? null), "syntax" => "ADD PRIMARY KEY", "message" => _gettext("A primary key has been added on %s."), "action" => "Primary", "titles" =>                 // line 139
($context["titles"] ?? null), "row" =>                 // line 140
$context["row"], "is_primary" => true, "table" =>                 // line 142
($context["table"] ?? null)]));
                // line 144
                echo "
                        ";
                // line 146
                echo "                        ";
                $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/display_structure.twig", 146)->display(twig_to_array(["type" =>                 // line 147
($context["type"] ?? null), "tbl_storage_engine" =>                 // line 148
($context["tbl_storage_engine"] ?? null), "class" => "add_unique unique nowrap", "has_field" => twig_in_filter(                // line 150
($context["field_name"] ?? null), ($context["columns_with_unique_index"] ?? null)), "has_link_class" => false, "url_query" =>                 // line 152
($context["url_query"] ?? null), "primary" =>                 // line 153
($context["primary"] ?? null), "syntax" => "ADD UNIQUE", "message" => _gettext("An index has been added on %s."), "action" => "Unique", "titles" =>                 // line 157
($context["titles"] ?? null), "row" =>                 // line 158
$context["row"], "is_primary" => false, "table" =>                 // line 160
($context["table"] ?? null)]));
                // line 162
                echo "
                        ";
                // line 164
                echo "                        ";
                $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/display_structure.twig", 164)->display(twig_to_array(["type" =>                 // line 165
($context["type"] ?? null), "tbl_storage_engine" =>                 // line 166
($context["tbl_storage_engine"] ?? null), "class" => "add_index nowrap", "has_field" => false, "has_link_class" => false, "url_query" =>                 // line 170
($context["url_query"] ?? null), "primary" =>                 // line 171
($context["primary"] ?? null), "syntax" => "ADD INDEX", "message" => _gettext("An index has been added on %s."), "action" => "Index", "titles" =>                 // line 175
($context["titles"] ?? null), "row" =>                 // line 176
$context["row"], "is_primary" => false, "table" =>                 // line 178
($context["table"] ?? null)]));
                // line 180
                echo "
                        ";
                // line 182
                echo "                        ";
                $context["spatial_types"] = [0 => "geometry", 1 => "point", 2 => "linestring", 3 => "polygon", 4 => "multipoint", 5 => "multilinestring", 6 => "multipolygon", 7 => "geomtrycollection"];
                // line 192
                echo "                        ";
                $this->loadTemplate("table/structure/action_row_in_structure_table.twig", "table/structure/display_structure.twig", 192)->display(twig_to_array(["type" =>                 // line 193
($context["type"] ?? null), "tbl_storage_engine" =>                 // line 194
($context["tbl_storage_engine"] ?? null), "class" => "spatial nowrap", "has_field" => (!twig_in_filter(                // line 196
($context["type"] ?? null), ($context["spatial_types"] ?? null)) && ((                // line 197
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (($context["mysql_int_version"] ?? null) >= 50705))), "has_link_class" => false, "url_query" =>                 // line 199
($context["url_query"] ?? null), "primary" =>                 // line 200
($context["primary"] ?? null), "syntax" => "ADD SPATIAL", "message" => _gettext("An index has been added on %s."), "action" => "Spatial", "titles" =>                 // line 204
($context["titles"] ?? null), "row" =>                 // line 205
$context["row"], "is_primary" => false, "table" =>                 // line 207
($context["table"] ?? null)]));
                // line 209
                echo "
                        ";
                // line 211
                echo "                        <li class=\"fulltext nowrap\">
                        ";
                // line 212
                if ((( !twig_test_empty(($context["tbl_storage_engine"] ?? null)) && ((((                // line 213
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (                // line 214
($context["tbl_storage_engine"] ?? null) == "ARIA")) || (                // line 215
($context["tbl_storage_engine"] ?? null) == "MARIA")) || ((                // line 216
($context["tbl_storage_engine"] ?? null) == "INNODB") && (($context["mysql_int_version"] ?? null) >= 50604)))) && (twig_in_filter("text",                 // line 217
($context["type"] ?? null)) || twig_in_filter("char", ($context["type"] ?? null))))) {
                    // line 218
                    echo "                            <a rel=\"samepage\" class=\"ajax add_key add_fulltext_anchor\" href=\"tbl_structure.php\"
                                data-post=\"";
                    // line 219
                    echo ($context["url_query"] ?? null);
                    echo "&amp;add_key=1&amp;sql_query=";
                    // line 220
                    echo twig_escape_filter($this->env, twig_urlencode_filter((((("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " ADD FULLTEXT(") . PhpMyAdmin\Util::backquote((($__internal_af3439635eb343262861f05093b3dcce5d4dae1e20a47bc25a2eef28135b0d55 =                     // line 221
$context["row"]) && is_array($__internal_af3439635eb343262861f05093b3dcce5d4dae1e20a47bc25a2eef28135b0d55) || $__internal_af3439635eb343262861f05093b3dcce5d4dae1e20a47bc25a2eef28135b0d55 instanceof ArrayAccess ? ($__internal_af3439635eb343262861f05093b3dcce5d4dae1e20a47bc25a2eef28135b0d55["Field"] ?? null) : null))) . ");")), "html", null, true);
                    // line 222
                    echo "&amp;message_to_show=";
                    // line 223
                    echo twig_escape_filter($this->env, twig_urlencode_filter(sprintf(_gettext("An index has been added on %s."), twig_escape_filter($this->env, (($__internal_b16f7904bcaaa7a87404cbf85addc7a8645dff94eef4e8ae7182b86e3638e76a = $context["row"]) && is_array($__internal_b16f7904bcaaa7a87404cbf85addc7a8645dff94eef4e8ae7182b86e3638e76a) || $__internal_b16f7904bcaaa7a87404cbf85addc7a8645dff94eef4e8ae7182b86e3638e76a instanceof ArrayAccess ? ($__internal_b16f7904bcaaa7a87404cbf85addc7a8645dff94eef4e8ae7182b86e3638e76a["Field"] ?? null) : null)))), "html", null, true);
                    echo "\">
                                ";
                    // line 224
                    echo (($__internal_462377748602ccf3a44a10ced4240983cec8df1ad86ab53e582fcddddb98fc88 = ($context["titles"] ?? null)) && is_array($__internal_462377748602ccf3a44a10ced4240983cec8df1ad86ab53e582fcddddb98fc88) || $__internal_462377748602ccf3a44a10ced4240983cec8df1ad86ab53e582fcddddb98fc88 instanceof ArrayAccess ? ($__internal_462377748602ccf3a44a10ced4240983cec8df1ad86ab53e582fcddddb98fc88["IdxFulltext"] ?? null) : null);
                    echo "
                            </a>
                        ";
                } else {
                    // line 227
                    echo "                            ";
                    echo (($__internal_be1db6a1ea9fa5c04c40f99df0ec5af053ca391863fc6256c5c4ee249724f758 = ($context["titles"] ?? null)) && is_array($__internal_be1db6a1ea9fa5c04c40f99df0ec5af053ca391863fc6256c5c4ee249724f758) || $__internal_be1db6a1ea9fa5c04c40f99df0ec5af053ca391863fc6256c5c4ee249724f758 instanceof ArrayAccess ? ($__internal_be1db6a1ea9fa5c04c40f99df0ec5af053ca391863fc6256c5c4ee249724f758["NoIdxFulltext"] ?? null) : null);
                    echo "
                        ";
                }
                // line 229
                echo "                        </li>

                        ";
                // line 232
                echo "                        <li class=\"browse nowrap\">
                            <a href=\"sql.php\" data-post=\"";
                // line 233
                echo ($context["url_query"] ?? null);
                echo "&amp;sql_query=";
                // line 234
                echo twig_escape_filter($this->env, twig_urlencode_filter(((((((((("SELECT COUNT(*) AS " . PhpMyAdmin\Util::backquote(_gettext("Rows"))) . ", ") . PhpMyAdmin\Util::backquote((($__internal_6e6eda1691934a8f5855a3221f5a9f036391304a5cda73a3a2009f2961a84c35 =                 // line 235
$context["row"]) && is_array($__internal_6e6eda1691934a8f5855a3221f5a9f036391304a5cda73a3a2009f2961a84c35) || $__internal_6e6eda1691934a8f5855a3221f5a9f036391304a5cda73a3a2009f2961a84c35 instanceof ArrayAccess ? ($__internal_6e6eda1691934a8f5855a3221f5a9f036391304a5cda73a3a2009f2961a84c35["Field"] ?? null) : null))) . " FROM ") . PhpMyAdmin\Util::backquote(                // line 236
($context["table"] ?? null))) . " GROUP BY ") . PhpMyAdmin\Util::backquote((($__internal_51c633083c79004f3cb5e9e2b2f3504f650f1561800582801028bcbcf733a06b =                 // line 237
$context["row"]) && is_array($__internal_51c633083c79004f3cb5e9e2b2f3504f650f1561800582801028bcbcf733a06b) || $__internal_51c633083c79004f3cb5e9e2b2f3504f650f1561800582801028bcbcf733a06b instanceof ArrayAccess ? ($__internal_51c633083c79004f3cb5e9e2b2f3504f650f1561800582801028bcbcf733a06b["Field"] ?? null) : null))) . " ORDER BY ") . PhpMyAdmin\Util::backquote((($__internal_064553f1273f2ea50405f85092d06733f3f2fe5d0fc42fda135e1fdc91ff26ae =                 // line 238
$context["row"]) && is_array($__internal_064553f1273f2ea50405f85092d06733f3f2fe5d0fc42fda135e1fdc91ff26ae) || $__internal_064553f1273f2ea50405f85092d06733f3f2fe5d0fc42fda135e1fdc91ff26ae instanceof ArrayAccess ? ($__internal_064553f1273f2ea50405f85092d06733f3f2fe5d0fc42fda135e1fdc91ff26ae["Field"] ?? null) : null)))), "html", null, true);
                // line 239
                echo "&amp;is_browse_distinct=1\">
                                ";
                // line 240
                echo (($__internal_7bef02f75e2984f8c7fcd4fd7871e286c87c0fdcb248271a136b01ac6dd5dd54 = ($context["titles"] ?? null)) && is_array($__internal_7bef02f75e2984f8c7fcd4fd7871e286c87c0fdcb248271a136b01ac6dd5dd54) || $__internal_7bef02f75e2984f8c7fcd4fd7871e286c87c0fdcb248271a136b01ac6dd5dd54 instanceof ArrayAccess ? ($__internal_7bef02f75e2984f8c7fcd4fd7871e286c87c0fdcb248271a136b01ac6dd5dd54["DistinctValues"] ?? null) : null);
                echo "
                            </a>
                        </li>
                        ";
                // line 243
                if (($context["central_columns_work"] ?? null)) {
                    // line 244
                    echo "                            <li class=\"browse nowrap\">
                            ";
                    // line 245
                    if (twig_in_filter((($__internal_d6ae6b41786cc4be7778386d06cb288c8e6ffd74e055cfed45d7a5c8854d0c8f = $context["row"]) && is_array($__internal_d6ae6b41786cc4be7778386d06cb288c8e6ffd74e055cfed45d7a5c8854d0c8f) || $__internal_d6ae6b41786cc4be7778386d06cb288c8e6ffd74e055cfed45d7a5c8854d0c8f instanceof ArrayAccess ? ($__internal_d6ae6b41786cc4be7778386d06cb288c8e6ffd74e055cfed45d7a5c8854d0c8f["Field"] ?? null) : null), ($context["central_list"] ?? null))) {
                        // line 246
                        echo "                                <a href=\"#\" class=\"central_columns remove_button\">
                                    ";
                        // line 247
                        echo PhpMyAdmin\Util::getIcon("centralColumns_delete", _gettext("Remove from central columns"));
                        echo "
                                </a>
                            ";
                    } else {
                        // line 250
                        echo "                                <a href=\"#\" class=\"central_columns add_button\">
                                    ";
                        // line 251
                        echo PhpMyAdmin\Util::getIcon("centralColumns_add", _gettext("Add to central columns"));
                        echo "
                                </a>
                            ";
                    }
                    // line 254
                    echo "                            </li>
                        ";
                }
                // line 256
                echo "                        ";
                if (($context["hide_structure_actions"] ?? null)) {
                    // line 257
                    echo "                                </ul>
                            </li>
                        ";
                }
                // line 260
                echo "                    </ul>
                </td>
            ";
            }
            // line 263
            echo "        </tr>
        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['row'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 265
        echo "        </tbody>
    </table>
    </div>
    <div class=\"print_ignore\">
        ";
        // line 269
        $this->loadTemplate("select_all.twig", "table/structure/display_structure.twig", 269)->display(twig_to_array(["pma_theme_image" =>         // line 270
($context["pma_theme_image"] ?? null), "text_dir" =>         // line 271
($context["text_dir"] ?? null), "form_name" => "fieldsForm"]));
        // line 274
        echo "
        ";
        // line 275
        echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Browse"), "b_browse", "browse");
        // line 281
        echo "

        ";
        // line 283
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 284
            echo "            ";
            echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit change_columns_anchor ajax", _gettext("Change"), "b_edit", "change");
            // line 290
            echo "
            ";
            // line 291
            echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Drop"), "b_drop", "drop");
            // line 297
            echo "

            ";
            // line 299
            if ((($context["tbl_storage_engine"] ?? null) != "ARCHIVE")) {
                // line 300
                echo "                ";
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Primary"), "b_primary", "primary");
                // line 306
                echo "
                ";
                // line 307
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Unique"), "b_unique", "unique");
                // line 313
                echo "
                ";
                // line 314
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Index"), "b_index", "index");
                // line 320
                echo "
                ";
                // line 321
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Fulltext"), "b_ftext", "ftext");
                // line 327
                echo "

                ";
                // line 329
                if (( !twig_test_empty(($context["tbl_storage_engine"] ?? null)) && (((                // line 330
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (                // line 331
($context["tbl_storage_engine"] ?? null) == "ARIA")) || (                // line 332
($context["tbl_storage_engine"] ?? null) == "MARIA")))) {
                    // line 333
                    echo "                    ";
                    echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Fulltext"), "b_ftext", "ftext");
                    // line 339
                    echo "
                ";
                }
                // line 341
                echo "
                ";
                // line 342
                if (($context["central_columns_work"] ?? null)) {
                    // line 343
                    echo "                    ";
                    echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Add to central columns"), "centralColumns_add", "add_to_central_columns");
                    // line 349
                    echo "
                    ";
                    // line 350
                    echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Remove from central columns"), "centralColumns_delete", "remove_from_central_columns");
                    // line 356
                    echo "
                ";
                }
                // line 358
                echo "            ";
            }
            // line 359
            echo "        ";
        }
        // line 360
        echo "    </div>
</form>
<hr class=\"print_ignore\">
<div id=\"move_columns_dialog\" class=\"hide\" title=\"";
        // line 363
        echo _gettext("Move columns");
        echo "\">
    <p>";
        // line 364
        echo _gettext("Move the columns by dragging them up and down.");
        echo "</p>
    <form action=\"tbl_structure.php\" name=\"move_column_form\" id=\"move_column_form\">
        <div>
            ";
        // line 367
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
        echo "
            <ul></ul>
        </div>
    </form>
</div>
";
        // line 373
        echo "<div id=\"structure-action-links\">
    ";
        // line 374
        if ((($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 375
            echo "        ";
            $context["edit_view_url"] = ("view_create.php" . ($context["edit_view_url"] ?? null));
            // line 376
            echo "        ";
            echo PhpMyAdmin\Util::linkOrButton(            // line 377
($context["edit_view_url"] ?? null), PhpMyAdmin\Util::getIcon("b_edit", _gettext("Edit view"), true));
            // line 379
            echo "
    ";
        }
        // line 381
        echo "    <a href=\"#\" id=\"printView\">";
        echo PhpMyAdmin\Util::getIcon("b_print", _gettext("Print"), true);
        echo "</a>
    ";
        // line 382
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 383
            echo "        ";
            // line 384
            echo "        ";
            if (((($context["mysql_int_version"] ?? null) < 80000) || ($context["is_mariadb"] ?? null))) {
                // line 385
                echo "          <a href=\"sql.php\" data-post=\"";
                echo ($context["url_query"] ?? null);
                echo "&amp;session_max_rows=all&amp;sql_query=";
                // line 386
                echo twig_escape_filter($this->env, twig_urlencode_filter((("SELECT * FROM " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " PROCEDURE ANALYSE()")), "html", null, true);
                // line 387
                echo "\" style=\"margin-right: 0;\">
              ";
                // line 388
                echo PhpMyAdmin\Util::getIcon("b_tblanalyse", _gettext("Propose table structure"), true);
                // line 392
                echo "
          </a>
          ";
                // line 394
                echo PhpMyAdmin\Util::showMySQLDocu("procedure_analyse");
                echo "
        ";
            }
            // line 396
            echo "        ";
            if (($context["is_active"] ?? null)) {
                // line 397
                echo "            <a href=\"tbl_tracking.php";
                echo ($context["url_query"] ?? null);
                echo "\">
                ";
                // line 398
                echo PhpMyAdmin\Util::getIcon("eye", _gettext("Track table"), true);
                echo "
            </a>
        ";
            }
            // line 401
            echo "        <a href=\"#\" id=\"move_columns_anchor\">
            ";
            // line 402
            echo PhpMyAdmin\Util::getIcon("b_move", _gettext("Move columns"), true);
            echo "
        </a>
        <a href=\"normalization.php";
            // line 404
            echo ($context["url_query"] ?? null);
            echo "\">
            ";
            // line 405
            echo PhpMyAdmin\Util::getIcon("normalize", _gettext("Normalize"), true);
            echo "
        </a>
    ";
        }
        // line 408
        echo "    ";
        if ((($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 409
            echo "        ";
            if (($context["is_active"] ?? null)) {
                // line 410
                echo "            <a href=\"tbl_tracking.php";
                echo ($context["url_query"] ?? null);
                echo "\">
                ";
                // line 411
                echo PhpMyAdmin\Util::getIcon("eye", _gettext("Track view"), true);
                echo "
            </a>
        ";
            }
            // line 414
            echo "    ";
        }
        // line 415
        echo "</div>
";
        // line 416
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 417
            echo "    <form method=\"post\" action=\"tbl_addfield.php\" id=\"addColumns\" name=\"addColumns\">
        ";
            // line 418
            echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
            echo "
        ";
            // line 419
            if (PhpMyAdmin\Util::showIcons("ActionLinksMode")) {
                // line 420
                echo "            ";
                echo PhpMyAdmin\Util::getImage("b_insrow", _gettext("Add column"));
                echo "&nbsp;
        ";
            }
            // line 422
            echo "        ";
            $context["num_fields"] = ('' === $tmp = "<input type=\"number\" name=\"num_fields\" value=\"1\" onfocus=\"this.select()\" min=\"1\" required>") ? '' : new Markup($tmp, $this->env->getCharset());
            // line 425
            echo "        ";
            echo sprintf(_gettext("Add %s column(s)"), ($context["num_fields"] ?? null));
            echo "
        <input type=\"hidden\" name=\"field_where\" value=\"after\">&nbsp;
        ";
            // line 428
            echo "        <select name=\"after_field\">
            <option value=\"first\" data-pos=\"first\">
                ";
            // line 430
            echo _gettext("at beginning of table");
            // line 431
            echo "            </option>
            ";
            // line 432
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["columns_list"] ?? null));
            $context['loop'] = [
              'parent' => $context['_parent'],
              'index0' => 0,
              'index'  => 1,
              'first'  => true,
            ];
            if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                $length = count($context['_seq']);
                $context['loop']['revindex0'] = $length - 1;
                $context['loop']['revindex'] = $length;
                $context['loop']['length'] = $length;
                $context['loop']['last'] = 1 === $length;
            }
            foreach ($context['_seq'] as $context["_key"] => $context["one_column_name"]) {
                // line 433
                echo "                <option value=\"";
                echo twig_escape_filter($this->env, $context["one_column_name"], "html", null, true);
                echo "\"";
                // line 434
                echo (((twig_get_attribute($this->env, $this->source, $context["loop"], "revindex0", [], "any", false, false, false, 434) == 0)) ? (" selected=\"selected\"") : (""));
                echo ">
                    ";
                // line 435
                echo twig_escape_filter($this->env, sprintf(_gettext("after %s"), $context["one_column_name"]), "html", null, true);
                echo "
                </option>
            ";
                ++$context['loop']['index0'];
                ++$context['loop']['index'];
                $context['loop']['first'] = false;
                if (isset($context['loop']['length'])) {
                    --$context['loop']['revindex0'];
                    --$context['loop']['revindex'];
                    $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                }
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['one_column_name'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 438
            echo "        </select>
        <input class=\"btn btn-primary\" type=\"submit\" value=\"";
            // line 439
            echo _gettext("Go");
            echo "\">
    </form>
";
        }
        // line 442
        echo "
";
        // line 444
        if ((( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null)) && ("ARCHIVE" !=         // line 445
($context["tbl_storage_engine"] ?? null)))) {
            // line 446
            echo "    ";
            echo ($context["displayIndexesHtml"] ?? null);
            echo "
";
        }
        // line 448
        echo "
";
        // line 450
        if (($context["have_partitioning"] ?? null)) {
            // line 451
            echo "    ";
            // line 452
            echo "    ";
            if (( !twig_test_empty(($context["partition_names"] ?? null)) &&  !(null === (($__internal_1dcdec7ec31e102fbfe45103ea3599c92c8609311e43d40ca0d95d0369434327 = ($context["partition_names"] ?? null)) && is_array($__internal_1dcdec7ec31e102fbfe45103ea3599c92c8609311e43d40ca0d95d0369434327) || $__internal_1dcdec7ec31e102fbfe45103ea3599c92c8609311e43d40ca0d95d0369434327 instanceof ArrayAccess ? ($__internal_1dcdec7ec31e102fbfe45103ea3599c92c8609311e43d40ca0d95d0369434327[0] ?? null) : null)))) {
                // line 453
                echo "        ";
                $context["first_partition"] = (($__internal_891ba2f942018e94e4bfa8069988f305bbaad7f54a64aeee069787f1084a9412 = ($context["partitions"] ?? null)) && is_array($__internal_891ba2f942018e94e4bfa8069988f305bbaad7f54a64aeee069787f1084a9412) || $__internal_891ba2f942018e94e4bfa8069988f305bbaad7f54a64aeee069787f1084a9412 instanceof ArrayAccess ? ($__internal_891ba2f942018e94e4bfa8069988f305bbaad7f54a64aeee069787f1084a9412[0] ?? null) : null);
                // line 454
                echo "        ";
                $context["range_or_list"] = ((((twig_get_attribute($this->env, $this->source, ($context["first_partition"] ?? null), "getMethod", [], "method", false, false, false, 454) == "RANGE") || (twig_get_attribute($this->env, $this->source,                 // line 455
($context["first_partition"] ?? null), "getMethod", [], "method", false, false, false, 455) == "RANGE COLUMNS")) || (twig_get_attribute($this->env, $this->source,                 // line 456
($context["first_partition"] ?? null), "getMethod", [], "method", false, false, false, 456) == "LIST")) || (twig_get_attribute($this->env, $this->source,                 // line 457
($context["first_partition"] ?? null), "getMethod", [], "method", false, false, false, 457) == "LIST COLUMNS"));
                // line 458
                echo "        ";
                $context["sub_partitions"] = twig_get_attribute($this->env, $this->source, ($context["first_partition"] ?? null), "getSubPartitions", [], "method", false, false, false, 458);
                // line 459
                echo "        ";
                $context["has_sub_partitions"] = twig_get_attribute($this->env, $this->source, ($context["first_partition"] ?? null), "hasSubPartitions", [], "method", false, false, false, 459);
                // line 460
                echo "        ";
                if (($context["has_sub_partitions"] ?? null)) {
                    // line 461
                    echo "            ";
                    $context["first_sub_partition"] = (($__internal_694b5f53081640f33aab1567e85e28c247e6a7c4674010716df6de8eae4819e9 = ($context["sub_partitions"] ?? null)) && is_array($__internal_694b5f53081640f33aab1567e85e28c247e6a7c4674010716df6de8eae4819e9) || $__internal_694b5f53081640f33aab1567e85e28c247e6a7c4674010716df6de8eae4819e9 instanceof ArrayAccess ? ($__internal_694b5f53081640f33aab1567e85e28c247e6a7c4674010716df6de8eae4819e9[0] ?? null) : null);
                    // line 462
                    echo "        ";
                }
                // line 463
                echo "
        ";
                // line 464
                $context["action_icons"] = ["ANALYZE" => PhpMyAdmin\Util::getIcon("b_search", _gettext("Analyze")), "CHECK" => PhpMyAdmin\Util::getIcon("eye", _gettext("Check")), "OPTIMIZE" => PhpMyAdmin\Util::getIcon("normalize", _gettext("Optimize")), "REBUILD" => PhpMyAdmin\Util::getIcon("s_tbl", _gettext("Rebuild")), "REPAIR" => PhpMyAdmin\Util::getIcon("b_tblops", _gettext("Repair")), "TRUNCATE" => PhpMyAdmin\Util::getIcon("b_empty", _gettext("Truncate"))];
                // line 472
                echo "        ";
                if (($context["range_or_list"] ?? null)) {
                    // line 473
                    echo "            ";
                    $context["action_icons"] = twig_array_merge(($context["action_icons"] ?? null), ["DROP" => PhpMyAdmin\Util::getIcon("b_drop", _gettext("Drop"))]);
                    // line 474
                    echo "        ";
                }
                // line 475
                echo "
        ";
                // line 477
                echo "        ";
                $this->loadTemplate("div_for_slider_effect.twig", "table/structure/display_structure.twig", 477)->display(twig_to_array(["id" => "partitions-2", "message" => _gettext("Partitions"), "initial_sliders_state" =>                 // line 480
($context["default_sliders_state"] ?? null)]));
                // line 482
                echo "
        ";
                // line 483
                $context["remove_sql"] = (("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " REMOVE PARTITIONING");
                // line 484
                echo "        ";
                $context["remove_url"] = ((("sql.php" . ($context["url_query"] ?? null)) . "&sql_query=") . twig_urlencode_filter(($context["remove_sql"] ?? null)));
                // line 485
                echo "
        ";
                // line 486
                $this->loadTemplate("table/structure/display_partitions.twig", "table/structure/display_structure.twig", 486)->display(twig_to_array(["db" =>                 // line 487
($context["db"] ?? null), "table" =>                 // line 488
($context["table"] ?? null), "url_query" =>                 // line 489
($context["url_query"] ?? null), "partitions" =>                 // line 490
($context["partitions"] ?? null), "partition_method" => twig_get_attribute($this->env, $this->source,                 // line 491
($context["first_partition"] ?? null), "getMethod", [], "method", false, false, false, 491), "partition_expression" => twig_get_attribute($this->env, $this->source,                 // line 492
($context["first_partition"] ?? null), "getExpression", [], "method", false, false, false, 492), "has_description" =>  !twig_test_empty(twig_get_attribute($this->env, $this->source,                 // line 493
($context["first_partition"] ?? null), "getDescription", [], "method", false, false, false, 493)), "has_sub_partitions" =>                 // line 494
($context["has_sub_partitions"] ?? null), "sub_partition_method" => ((                // line 495
($context["has_sub_partitions"] ?? null)) ? (twig_get_attribute($this->env, $this->source, ($context["first_sub_partition"] ?? null), "getMethod", [], "method", false, false, false, 495)) : ("")), "sub_partition_expression" => ((                // line 496
($context["has_sub_partitions"] ?? null)) ? (twig_get_attribute($this->env, $this->source, ($context["first_sub_partition"] ?? null), "getExpression", [], "method", false, false, false, 496)) : ("")), "action_icons" =>                 // line 497
($context["action_icons"] ?? null), "range_or_list" =>                 // line 498
($context["range_or_list"] ?? null), "remove_url" =>                 // line 499
($context["remove_url"] ?? null)]));
                // line 501
                echo "    ";
            } else {
                // line 502
                echo "        ";
                $this->loadTemplate("table/structure/display_partitions.twig", "table/structure/display_structure.twig", 502)->display(twig_to_array(["db" =>                 // line 503
($context["db"] ?? null), "table" =>                 // line 504
($context["table"] ?? null)]));
                // line 506
                echo "    ";
            }
            // line 507
            echo "    ";
            // line 508
            echo "    </div>
";
        }
        // line 510
        echo "
";
        // line 512
        if (($context["show_stats"] ?? null)) {
            // line 513
            echo "    ";
            echo ($context["table_stats"] ?? null);
            echo "
";
        }
        // line 515
        echo "<div class=\"clearfloat\"></div>
";
    }

    public function getTemplateName()
    {
        return "table/structure/display_structure.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  962 => 515,  956 => 513,  954 => 512,  951 => 510,  947 => 508,  945 => 507,  942 => 506,  940 => 504,  939 => 503,  937 => 502,  934 => 501,  932 => 499,  931 => 498,  930 => 497,  929 => 496,  928 => 495,  927 => 494,  926 => 493,  925 => 492,  924 => 491,  923 => 490,  922 => 489,  921 => 488,  920 => 487,  919 => 486,  916 => 485,  913 => 484,  911 => 483,  908 => 482,  906 => 480,  904 => 477,  901 => 475,  898 => 474,  895 => 473,  892 => 472,  890 => 464,  887 => 463,  884 => 462,  881 => 461,  878 => 460,  875 => 459,  872 => 458,  870 => 457,  869 => 456,  868 => 455,  866 => 454,  863 => 453,  860 => 452,  858 => 451,  856 => 450,  853 => 448,  847 => 446,  845 => 445,  844 => 444,  841 => 442,  835 => 439,  832 => 438,  815 => 435,  811 => 434,  807 => 433,  790 => 432,  787 => 431,  785 => 430,  781 => 428,  775 => 425,  772 => 422,  766 => 420,  764 => 419,  760 => 418,  757 => 417,  755 => 416,  752 => 415,  749 => 414,  743 => 411,  738 => 410,  735 => 409,  732 => 408,  726 => 405,  722 => 404,  717 => 402,  714 => 401,  708 => 398,  703 => 397,  700 => 396,  695 => 394,  691 => 392,  689 => 388,  686 => 387,  684 => 386,  680 => 385,  677 => 384,  675 => 383,  673 => 382,  668 => 381,  664 => 379,  662 => 377,  660 => 376,  657 => 375,  655 => 374,  652 => 373,  644 => 367,  638 => 364,  634 => 363,  629 => 360,  626 => 359,  623 => 358,  619 => 356,  617 => 350,  614 => 349,  611 => 343,  609 => 342,  606 => 341,  602 => 339,  599 => 333,  597 => 332,  596 => 331,  595 => 330,  594 => 329,  590 => 327,  588 => 321,  585 => 320,  583 => 314,  580 => 313,  578 => 307,  575 => 306,  572 => 300,  570 => 299,  566 => 297,  564 => 291,  561 => 290,  558 => 284,  556 => 283,  552 => 281,  550 => 275,  547 => 274,  545 => 271,  544 => 270,  543 => 269,  537 => 265,  530 => 263,  525 => 260,  520 => 257,  517 => 256,  513 => 254,  507 => 251,  504 => 250,  498 => 247,  495 => 246,  493 => 245,  490 => 244,  488 => 243,  482 => 240,  479 => 239,  477 => 238,  476 => 237,  475 => 236,  474 => 235,  473 => 234,  470 => 233,  467 => 232,  463 => 229,  457 => 227,  451 => 224,  447 => 223,  445 => 222,  443 => 221,  442 => 220,  439 => 219,  436 => 218,  434 => 217,  433 => 216,  432 => 215,  431 => 214,  430 => 213,  429 => 212,  426 => 211,  423 => 209,  421 => 207,  420 => 205,  419 => 204,  418 => 200,  417 => 199,  416 => 197,  415 => 196,  414 => 194,  413 => 193,  411 => 192,  408 => 182,  405 => 180,  403 => 178,  402 => 176,  401 => 175,  400 => 171,  399 => 170,  398 => 166,  397 => 165,  395 => 164,  392 => 162,  390 => 160,  389 => 158,  388 => 157,  387 => 153,  386 => 152,  385 => 150,  384 => 148,  383 => 147,  381 => 146,  378 => 144,  376 => 142,  375 => 140,  374 => 139,  373 => 135,  372 => 134,  371 => 132,  370 => 130,  369 => 129,  367 => 128,  365 => 127,  359 => 124,  356 => 123,  354 => 122,  350 => 120,  347 => 119,  345 => 118,  342 => 117,  335 => 113,  331 => 112,  327 => 111,  325 => 110,  324 => 109,  321 => 108,  314 => 104,  308 => 103,  305 => 101,  303 => 100,  298 => 99,  292 => 96,  289 => 95,  287 => 94,  284 => 93,  278 => 91,  274 => 89,  271 => 88,  265 => 86,  259 => 84,  256 => 83,  254 => 82,  249 => 80,  245 => 79,  242 => 78,  234 => 76,  232 => 75,  227 => 72,  219 => 70,  217 => 69,  216 => 68,  212 => 67,  207 => 65,  200 => 62,  194 => 60,  186 => 58,  184 => 57,  180 => 56,  175 => 54,  168 => 52,  163 => 49,  161 => 48,  158 => 47,  156 => 46,  153 => 45,  151 => 44,  148 => 43,  145 => 42,  140 => 41,  137 => 40,  132 => 36,  126 => 34,  123 => 33,  120 => 32,  115 => 30,  110 => 28,  108 => 27,  104 => 26,  100 => 25,  96 => 24,  92 => 23,  88 => 22,  84 => 21,  78 => 17,  73 => 13,  70 => 12,  67 => 10,  65 => 9,  63 => 8,  61 => 7,  57 => 5,  53 => 4,  50 => 3,  46 => 2,  35 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/structure/display_structure.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\display_structure.twig");
    }
}
