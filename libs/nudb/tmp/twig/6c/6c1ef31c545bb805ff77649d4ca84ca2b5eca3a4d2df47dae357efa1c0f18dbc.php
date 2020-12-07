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

/* table/search/input_box.twig */
class __TwigTemplate_5f415a60d826c37d4d2286dbfc00f2601ca7dce986ea529c3a5dacba4ab6de34 extends \Twig\Template
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
        if ((($context["foreigners"] ?? null) && call_user_func_array($this->env->getFunction('search_column_in_foreigners')->getCallable(), [($context["foreigners"] ?? null), ($context["column_name"] ?? null)]))) {
            // line 3
            echo "    ";
            if (twig_test_iterable((($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["foreign_data"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4["disp_row"] ?? null) : null))) {
                // line 4
                echo "        <select name=\"criteriaValues[";
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "]\"
            id=\"";
                // line 5
                echo twig_escape_filter($this->env, ($context["column_id"] ?? null), "html", null, true);
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "\">
            ";
                // line 6
                echo call_user_func_array($this->env->getFunction('foreign_dropdown')->getCallable(), [(($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 =                 // line 7
($context["foreign_data"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144["disp_row"] ?? null) : null), (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b =                 // line 8
($context["foreign_data"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b["foreign_field"] ?? null) : null), (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 =                 // line 9
($context["foreign_data"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002["foreign_display"] ?? null) : null), "",                 // line 11
($context["foreign_max_limit"] ?? null)]);
                // line 12
                echo "
        </select>
    ";
            } elseif (((($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 =             // line 14
($context["foreign_data"] ?? null)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4["foreign_link"] ?? null) : null) == true)) {
                // line 15
                echo "        <input type=\"text\"
            id=\"";
                // line 16
                echo twig_escape_filter($this->env, ($context["column_id"] ?? null), "html", null, true);
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "\"
            name=\"criteriaValues[";
                // line 17
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "]\"
            id=\"field_";
                // line 18
                echo twig_escape_filter($this->env, ($context["column_name_hash"] ?? null), "html", null, true);
                echo "[";
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "]\"
            class=\"textfield\"
            ";
                // line 20
                if (twig_get_attribute($this->env, $this->source, ($context["criteria_values"] ?? null), ($context["column_index"] ?? null), [], "array", true, true, false, 20)) {
                    // line 21
                    echo "                value=\"";
                    echo twig_escape_filter($this->env, (($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 = ($context["criteria_values"] ?? null)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666[($context["column_index"] ?? null)] ?? null) : null), "html", null, true);
                    echo "\"
            ";
                }
                // line 22
                echo ">
        <a class=\"ajax browse_foreign\" href=\"browse_foreigners.php\" data-post=\"";
                // line 24
                echo PhpMyAdmin\Url::getCommon(["db" => ($context["db"] ?? null), "table" => ($context["table"] ?? null)], "");
                // line 25
                echo "&amp;field=";
                echo twig_escape_filter($this->env, twig_urlencode_filter(($context["column_name"] ?? null)), "html", null, true);
                echo "&amp;fieldkey=";
                // line 26
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "&amp;fromsearch=1\">
            ";
                // line 27
                echo twig_replace_filter((($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e = ($context["titles"] ?? null)) && is_array($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e) || $__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e instanceof ArrayAccess ? ($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e["Browse"] ?? null) : null), ["'" => "\\'"]);
                echo "
        </a>
    ";
            }
        } elseif (twig_in_filter(        // line 30
($context["column_type"] ?? null), PhpMyAdmin\Util::getGISDatatypes())) {
            // line 31
            echo "    <input type=\"text\"
        name=\"criteriaValues[";
            // line 32
            echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
            echo "]\"
        size=\"40\"
        class=\"textfield\"
        id=\"field_";
            // line 35
            echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
            echo "\">
    ";
            // line 36
            if (($context["in_fbs"] ?? null)) {
                // line 37
                echo "        ";
                $context["edit_url"] = ("gis_data_editor.php" . PhpMyAdmin\Url::getCommon());
                // line 38
                echo "        ";
                $context["edit_str"] = PhpMyAdmin\Util::getIcon("b_edit", _gettext("Edit/Insert"));
                // line 39
                echo "        <span class=\"open_search_gis_editor\">
            ";
                // line 40
                echo PhpMyAdmin\Util::linkOrButton(($context["edit_url"] ?? null), ($context["edit_str"] ?? null), [], "_blank");
                echo "
        </span>
    ";
            }
        } elseif (((is_string($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 =         // line 43
($context["column_type"] ?? null)) && is_string($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 = "enum") && ('' === $__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 || 0 === strpos($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52, $__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136))) || ((is_string($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386 =         // line 44
($context["column_type"] ?? null)) && is_string($__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 = "set") && ('' === $__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9 || 0 === strpos($__internal_887a873a4dc3cf8bd4f99c487b4c7727999c350cc3a772414714e49a195e4386, $__internal_d527c24a729d38501d770b40a0d25e1ce8a7f0bff897cc4f8f449ba71fcff3d9))) && ($context["in_zoom_search_edit"] ?? null)))) {
            // line 45
            echo "    ";
            $context["in_zoom_search_edit"] = false;
            // line 46
            echo "    ";
            $context["value"] = twig_split_filter($this->env, twig_replace_filter(twig_slice($this->env, twig_escape_filter($this->env, ($context["column_type"] ?? null)), 5,  -1), ["&#039;" => ""]), ", ");
            // line 47
            echo "    ";
            $context["cnt_value"] = twig_length_filter($this->env, ($context["value"] ?? null));
            // line 48
            echo "    ";
            // line 54
            echo "    ";
            if ((((is_string($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae = ($context["column_type"] ?? null)) && is_string($__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f = "enum") && ('' === $__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f || 0 === strpos($__internal_f6dde3a1020453fdf35e718e94f93ce8eb8803b28cc77a665308e14bbe8572ae, $__internal_25c0fab8152b8dd6b90603159c0f2e8a936a09ab76edb5e4d7bc95d9a8d2dc8f))) &&  !($context["in_zoom_search_edit"] ?? null)) || ((is_string($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40 =             // line 55
($context["column_type"] ?? null)) && is_string($__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f = "set") && ('' === $__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f || 0 === strpos($__internal_f769f712f3484f00110c86425acea59f5af2752239e2e8596bcb6effeb425b40, $__internal_98e944456c0f58b2585e4aa36e3a7e43f4b7c9038088f0f056004af41f4a007f))) && ($context["in_zoom_search_edit"] ?? null)))) {
                // line 56
                echo "        <select name=\"criteriaValues[";
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "]\"
            id=\"";
                // line 57
                echo twig_escape_filter($this->env, ($context["column_id"] ?? null), "html", null, true);
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "\">
    ";
            } else {
                // line 59
                echo "        <select name=\"criteriaValues[";
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "]\"
            id=\"";
                // line 60
                echo twig_escape_filter($this->env, ($context["column_id"] ?? null), "html", null, true);
                echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
                echo "\"
            multiple=\"multiple\"
            size=\"";
                // line 62
                echo twig_escape_filter($this->env, min(3, ($context["cnt_value"] ?? null)), "html", null, true);
                echo "\">
    ";
            }
            // line 64
            echo "    ";
            // line 65
            echo "    <option value=\"\"></option>
    ";
            // line 66
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(range(0, (($context["cnt_value"] ?? null) - 1)));
            foreach ($context['_seq'] as $context["_key"] => $context["i"]) {
                // line 67
                echo "        ";
                if (((twig_get_attribute($this->env, $this->source, ($context["criteria_values"] ?? null), ($context["column_index"] ?? null), [], "array", true, true, false, 67) && twig_test_iterable((($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 =                 // line 68
($context["criteria_values"] ?? null)) && is_array($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760) || $__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760 instanceof ArrayAccess ? ($__internal_a06a70691a7ca361709a372174fa669f5ee1c1e4ed302b3a5b61c10c80c02760[($context["column_index"] ?? null)] ?? null) : null))) && twig_in_filter((($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce =                 // line 69
($context["value"] ?? null)) && is_array($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce) || $__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce instanceof ArrayAccess ? ($__internal_653499042eb14fd8415489ba6fa87c1e85cff03392e9f57b26d0da09b9be82ce[$context["i"]] ?? null) : null), (($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b = ($context["criteria_values"] ?? null)) && is_array($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b) || $__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b instanceof ArrayAccess ? ($__internal_ba9f0a3bb95c082f61c9fbf892a05514d732703d52edc77b51f2e6284135900b[($context["column_index"] ?? null)] ?? null) : null)))) {
                    // line 70
                    echo "            <option value=\"";
                    echo (($__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c = ($context["value"] ?? null)) && is_array($__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c) || $__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c instanceof ArrayAccess ? ($__internal_73db8eef4d2582468dab79a6b09c77ce3b48675a610afd65a1f325b68804a60c[$context["i"]] ?? null) : null);
                    echo "\" selected>
                ";
                    // line 71
                    echo (($__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972 = ($context["value"] ?? null)) && is_array($__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972) || $__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972 instanceof ArrayAccess ? ($__internal_d8ad5934f1874c52fa2ac9a4dfae52038b39b8b03cfc82eeb53de6151d883972[$context["i"]] ?? null) : null);
                    echo "
            </option>
        ";
                } else {
                    // line 74
                    echo "            <option value=\"";
                    echo (($__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216 = ($context["value"] ?? null)) && is_array($__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216) || $__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216 instanceof ArrayAccess ? ($__internal_df39c71428eaf37baa1ea2198679e0077f3699bdd31bb5ba10d084710b9da216[$context["i"]] ?? null) : null);
                    echo "\">
                ";
                    // line 75
                    echo (($__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0 = ($context["value"] ?? null)) && is_array($__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0) || $__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0 instanceof ArrayAccess ? ($__internal_bf0e189d688dc2ad611b50a437a32d3692fb6b8be90d2228617cfa6db44e75c0[$context["i"]] ?? null) : null);
                    echo "
            </option>
        ";
                }
                // line 78
                echo "    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['i'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 79
            echo "    </select>
";
        } else {
            // line 81
            echo "    ";
            $context["the_class"] = "textfield";
            // line 82
            echo "    ";
            if ((($context["column_type"] ?? null) == "date")) {
                // line 83
                echo "        ";
                $context["the_class"] = (($context["the_class"] ?? null) . " datefield");
                // line 84
                echo "    ";
            } elseif (((($context["column_type"] ?? null) == "datetime") || (is_string($__internal_674c0abf302105af78b0a38907d86c5dd0028bdc3ee5f24bf52771a16487760c = ($context["column_type"] ?? null)) && is_string($__internal_dd839fbfcab68823c49af471c7df7659a500fe72e71b58d6b80d896bdb55e75f = "timestamp") && ('' === $__internal_dd839fbfcab68823c49af471c7df7659a500fe72e71b58d6b80d896bdb55e75f || 0 === strpos($__internal_674c0abf302105af78b0a38907d86c5dd0028bdc3ee5f24bf52771a16487760c, $__internal_dd839fbfcab68823c49af471c7df7659a500fe72e71b58d6b80d896bdb55e75f))))) {
                // line 85
                echo "        ";
                $context["the_class"] = (($context["the_class"] ?? null) . " datetimefield");
                // line 86
                echo "    ";
            } elseif ((is_string($__internal_a7ed47878554bdc32b70e1ba5ccc67d2302196876fbf62b4c853b20cb9e029fc = ($context["column_type"] ?? null)) && is_string($__internal_e5d7b41e16b744b68da1e9bb49047b8028ced86c782900009b4b4029b83d4b55 = "bit") && ('' === $__internal_e5d7b41e16b744b68da1e9bb49047b8028ced86c782900009b4b4029b83d4b55 || 0 === strpos($__internal_a7ed47878554bdc32b70e1ba5ccc67d2302196876fbf62b4c853b20cb9e029fc, $__internal_e5d7b41e16b744b68da1e9bb49047b8028ced86c782900009b4b4029b83d4b55)))) {
                // line 87
                echo "        ";
                $context["the_class"] = (($context["the_class"] ?? null) . " bit");
                // line 88
                echo "    ";
            }
            // line 89
            echo "    <input type=\"text\"
        name=\"criteriaValues[";
            // line 90
            echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
            echo "]\"
        data-type=\"";
            // line 91
            echo twig_escape_filter($this->env, ($context["column_type"] ?? null), "html", null, true);
            echo "\"
        ";
            // line 92
            echo ($context["html_attributes"] ?? null);
            echo "
        size=\"40\"
        class=\"";
            // line 94
            echo twig_escape_filter($this->env, ($context["the_class"] ?? null), "html", null, true);
            echo "\"
        id=\"";
            // line 95
            echo twig_escape_filter($this->env, ($context["column_id"] ?? null), "html", null, true);
            echo twig_escape_filter($this->env, ($context["column_index"] ?? null), "html", null, true);
            echo "\"
        ";
            // line 96
            if (twig_get_attribute($this->env, $this->source, ($context["criteria_values"] ?? null), ($context["column_index"] ?? null), [], "array", true, true, false, 96)) {
                // line 97
                echo "           value=\"";
                echo twig_escape_filter($this->env, (($__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba = ($context["criteria_values"] ?? null)) && is_array($__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba) || $__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba instanceof ArrayAccess ? ($__internal_9e93f398968fa0576dce82fd00f280e95c734ad3f84e7816ff09158ae224f5ba[($context["column_index"] ?? null)] ?? null) : null), "html", null, true);
                echo "\"";
            }
            // line 98
            echo ">
";
        }
    }

    public function getTemplateName()
    {
        return "table/search/input_box.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  289 => 98,  284 => 97,  282 => 96,  277 => 95,  273 => 94,  268 => 92,  264 => 91,  260 => 90,  257 => 89,  254 => 88,  251 => 87,  248 => 86,  245 => 85,  242 => 84,  239 => 83,  236 => 82,  233 => 81,  229 => 79,  223 => 78,  217 => 75,  212 => 74,  206 => 71,  201 => 70,  199 => 69,  198 => 68,  196 => 67,  192 => 66,  189 => 65,  187 => 64,  182 => 62,  176 => 60,  171 => 59,  165 => 57,  160 => 56,  158 => 55,  156 => 54,  154 => 48,  151 => 47,  148 => 46,  145 => 45,  143 => 44,  142 => 43,  136 => 40,  133 => 39,  130 => 38,  127 => 37,  125 => 36,  121 => 35,  115 => 32,  112 => 31,  110 => 30,  104 => 27,  100 => 26,  96 => 25,  94 => 24,  91 => 22,  85 => 21,  83 => 20,  76 => 18,  72 => 17,  67 => 16,  64 => 15,  62 => 14,  58 => 12,  56 => 11,  55 => 9,  54 => 8,  53 => 7,  52 => 6,  47 => 5,  42 => 4,  39 => 3,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/search/input_box.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\search\\input_box.twig");
    }
}
