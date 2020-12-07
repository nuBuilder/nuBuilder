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

/* table/search/selection_form.twig */
class __TwigTemplate_97d3252bd7a1280321045a9cc6bf299a2df30758b08945d4bc465c844c441b00 extends \Twig\Template
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
        // line 1
        if ((($context["search_type"] ?? null) == "zoom")) {
            // line 2
            echo "    ";
            $this->loadTemplate("table/search/form_tag.twig", "table/search/selection_form.twig", 2)->display(twig_to_array(["script_name" => "tbl_zoom_select.php", "form_id" => "zoom_search_form", "db" =>             // line 5
($context["db"] ?? null), "table" =>             // line 6
($context["table"] ?? null), "goto" =>             // line 7
($context["goto"] ?? null)]));
            // line 9
            echo "    <fieldset id=\"fieldset_zoom_search\">
        <fieldset id=\"inputSection\">
            <legend>
                ";
            // line 12
            echo _gettext("Do a \"query by example\" (wildcard: \"%\") for two different columns");
            // line 13
            echo "            </legend>
            ";
            // line 14
            $this->loadTemplate("table/search/fields_table.twig", "table/search/selection_form.twig", 14)->display(twig_to_array(["self" =>             // line 15
($context["self"] ?? null), "search_type" =>             // line 16
($context["search_type"] ?? null), "geom_column_flag" =>             // line 17
($context["geom_column_flag"] ?? null), "column_names" =>             // line 18
($context["column_names"] ?? null), "column_types" =>             // line 19
($context["column_types"] ?? null), "column_collations" =>             // line 20
($context["column_collations"] ?? null), "keys" =>             // line 21
($context["keys"] ?? null), "criteria_column_names" =>             // line 22
($context["criteria_column_names"] ?? null), "criteria_column_types" =>             // line 23
($context["criteria_column_types"] ?? null)]));
            // line 24
            echo "<table class=\"data\">
                ";
            // line 26
            echo "                <tr>
                    <td>
                        <label for=\"dataLabel\">
                            ";
            // line 29
            echo _gettext("Use this column to label each point");
            // line 30
            echo "                        </label>
                    </td>
                    <td>
                        <select name=\"dataLabel\" id=\"dataLabel\" >
                            <option value = \"\">
                                ";
            // line 35
            echo _gettext("None");
            // line 36
            echo "                            </option>
                            ";
            // line 37
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(range(0, (twig_length_filter($this->env, ($context["column_names"] ?? null)) - 1)));
            foreach ($context['_seq'] as $context["_key"] => $context["i"]) {
                // line 38
                echo "                                ";
                if (((isset($context["data_label"]) || array_key_exists("data_label", $context)) && (($context["data_label"] ?? null) == twig_escape_filter($this->env, (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["column_names"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4[$context["i"]] ?? null) : null))))) {
                    // line 39
                    echo "                                    <option value=\"";
                    echo twig_escape_filter($this->env, (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = ($context["column_names"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144[$context["i"]] ?? null) : null), "html", null, true);
                    echo "\" selected=\"selected\">
                                        ";
                    // line 40
                    echo twig_escape_filter($this->env, (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = ($context["column_names"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b[$context["i"]] ?? null) : null), "html", null, true);
                    echo "
                                    </option>
                                ";
                } else {
                    // line 43
                    echo "                                    <option value=\"";
                    echo twig_escape_filter($this->env, (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = ($context["column_names"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002[$context["i"]] ?? null) : null), "html", null, true);
                    echo "\" >
                                        ";
                    // line 44
                    echo twig_escape_filter($this->env, (($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 = ($context["column_names"] ?? null)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4[$context["i"]] ?? null) : null), "html", null, true);
                    echo "
                                    </option>
                                ";
                }
                // line 47
                echo "                            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['i'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 48
            echo "                        </select>
                    </td>
                </tr>
                ";
            // line 52
            echo "                <tr>
                    <td>
                        <label for=\"maxRowPlotLimit\">
                            ";
            // line 55
            echo _gettext("Maximum rows to plot");
            // line 56
            echo "                        </label>
                    </td>
                    <td>
                        <input type=\"number\"
                            name=\"maxPlotLimit\"
                            id=\"maxRowPlotLimit\"
                            required=\"required\"
                            value=\"";
            // line 63
            echo twig_escape_filter($this->env, ($context["max_plot_limit"] ?? null), "html", null, true);
            echo "\">
                    </td>
                </tr>
            </table>
        </fieldset>
    </fieldset>
";
        } elseif ((        // line 69
($context["search_type"] ?? null) == "normal")) {
            // line 70
            echo "    ";
            $this->loadTemplate("table/search/form_tag.twig", "table/search/selection_form.twig", 70)->display(twig_to_array(["script_name" => "tbl_select.php", "form_id" => "tbl_search_form", "db" =>             // line 73
($context["db"] ?? null), "table" =>             // line 74
($context["table"] ?? null), "goto" =>             // line 75
($context["goto"] ?? null)]));
            // line 77
            echo "    <fieldset id=\"fieldset_table_search\">
        <fieldset id=\"fieldset_table_qbe\">
            <legend>
                ";
            // line 80
            echo _gettext("Do a \"query by example\" (wildcard: \"%\")");
            // line 81
            echo "            </legend>
            <div class=\"responsivetable jsresponsive\">
                ";
            // line 83
            $this->loadTemplate("table/search/fields_table.twig", "table/search/selection_form.twig", 83)->display(twig_to_array(["self" =>             // line 84
($context["self"] ?? null), "search_type" =>             // line 85
($context["search_type"] ?? null), "geom_column_flag" =>             // line 86
($context["geom_column_flag"] ?? null), "column_names" =>             // line 87
($context["column_names"] ?? null), "column_types" =>             // line 88
($context["column_types"] ?? null), "column_collations" =>             // line 89
($context["column_collations"] ?? null), "criteria_column_names" =>             // line 90
($context["criteria_column_names"] ?? null), "criteria_column_types" =>             // line 91
($context["criteria_column_types"] ?? null)]));
            // line 93
            echo "            </div>
            <div id=\"gis_editor\"></div>
            <div id=\"popup_background\"></div>
        </fieldset>
        ";
            // line 97
            $this->loadTemplate("div_for_slider_effect.twig", "table/search/selection_form.twig", 97)->display(twig_to_array(["id" => "searchoptions", "message" => _gettext("Options"), "initial_sliders_state" =>             // line 100
($context["default_sliders_state"] ?? null)]));
            // line 102
            echo "
        ";
            // line 104
            echo "        <fieldset id=\"fieldset_select_fields\">
            <legend>
                ";
            // line 106
            echo _gettext("Select columns (at least one):");
            // line 107
            echo "            </legend>
            <select name=\"columnsToDisplay[]\"
                size=\"";
            // line 109
            echo twig_escape_filter($this->env, min(twig_length_filter($this->env, ($context["column_names"] ?? null)), 10), "html", null, true);
            echo "\"
                multiple=\"multiple\">
                ";
            // line 111
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["column_names"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["each_field"]) {
                // line 112
                echo "                    <option value=\"";
                echo twig_escape_filter($this->env, $context["each_field"], "html", null, true);
                echo "\"
                        selected=\"selected\">
                        ";
                // line 114
                echo twig_escape_filter($this->env, $context["each_field"], "html", null, true);
                echo "
                    </option>
                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['each_field'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 117
            echo "            </select>
            <input type=\"checkbox\" name=\"distinct\" value=\"DISTINCT\" id=\"oDistinct\">
            <label for=\"oDistinct\">DISTINCT</label>
        </fieldset>

        ";
            // line 123
            echo "        <fieldset id=\"fieldset_search_conditions\">
            <legend>
                <em>";
            // line 125
            echo _gettext("Or");
            echo "</em>
                ";
            // line 126
            echo _gettext("Add search conditions (body of the \"where\" clause):");
            // line 127
            echo "            </legend>
            ";
            // line 128
            echo PhpMyAdmin\Util::showMySQLDocu("Functions");
            echo "
            <input type=\"text\" name=\"customWhereClause\" class=\"textfield\" size=\"64\">
        </fieldset>

        ";
            // line 133
            echo "        <fieldset id=\"fieldset_limit_rows\">
            <legend>";
            // line 134
            echo _gettext("Number of rows per page");
            echo "</legend>
            <input type=\"number\"
                name=\"session_max_rows\"
                required=\"required\"
                min=\"1\"
                value=\"";
            // line 139
            echo twig_escape_filter($this->env, ($context["max_rows"] ?? null), "html", null, true);
            echo "\"
                class=\"textfield\">
        </fieldset>

        ";
            // line 144
            echo "        <fieldset id=\"fieldset_display_order\">
            <legend>";
            // line 145
            echo _gettext("Display order:");
            echo "</legend>
            <select name=\"orderByColumn\"><option value=\"--nil--\"></option>
                ";
            // line 147
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["column_names"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["each_field"]) {
                // line 148
                echo "                    <option value=\"";
                echo twig_escape_filter($this->env, $context["each_field"], "html", null, true);
                echo "\">
                        ";
                // line 149
                echo twig_escape_filter($this->env, $context["each_field"], "html", null, true);
                echo "
                    </option>
                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['each_field'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 152
            echo "            </select>

            ";
            // line 154
            echo PhpMyAdmin\Util::getRadioFields("order", ["ASC" => _gettext("Ascending"), "DESC" => _gettext("Descending")], "ASC", false, true, "formelement");
            // line 164
            echo "

        </fieldset>
        <div class=\"clearfloat\"></div>
    </fieldset>
";
        } elseif ((        // line 169
($context["search_type"] ?? null) == "replace")) {
            // line 170
            echo "    ";
            $this->loadTemplate("table/search/form_tag.twig", "table/search/selection_form.twig", 170)->display(twig_to_array(["script_name" => "tbl_find_replace.php", "form_id" => "find_replace_form", "db" =>             // line 173
($context["db"] ?? null), "table" =>             // line 174
($context["table"] ?? null), "goto" =>             // line 175
($context["goto"] ?? null)]));
            // line 177
            echo "    <fieldset id=\"fieldset_find_replace\">
        <fieldset id=\"fieldset_find\">
            <legend>
                ";
            // line 180
            echo _gettext("Find and replace");
            // line 181
            echo "            </legend>";
            echo _gettext("Find:");
            // line 182
            echo "            <input type=\"text\" value=\"\" name=\"find\" required>
            ";
            // line 183
            echo _gettext("Replace with:");
            // line 184
            echo "            <input type=\"text\" value=\"\" name=\"replaceWith\">

            ";
            // line 186
            echo _gettext("Column:");
            // line 187
            echo "            <select name=\"columnIndex\">
                ";
            // line 188
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(range(0, (twig_length_filter($this->env, ($context["column_names"] ?? null)) - 1)));
            foreach ($context['_seq'] as $context["_key"] => $context["i"]) {
                // line 189
                echo "                    ";
                $context["type"] = (($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 = ($context["types"] ?? null)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666[(($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e = ($context["column_names"] ?? null)) && is_array($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e) || $__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e instanceof ArrayAccess ? ($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e[$context["i"]] ?? null) : null)] ?? null) : null);
                // line 190
                echo "
                    ";
                // line 191
                if ((twig_get_attribute($this->env, $this->source, ($context["sql_types"] ?? null), "getTypeClass", [0 => ($context["type"] ?? null)], "method", false, false, false, 191) == "CHAR")) {
                    // line 192
                    echo "                        <option value=\"";
                    echo twig_escape_filter($this->env, $context["i"], "html", null, true);
                    echo "\">";
                    // line 193
                    echo twig_escape_filter($this->env, (($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 = ($context["column_names"] ?? null)) && is_array($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52) || $__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 instanceof ArrayAccess ? ($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52[$context["i"]] ?? null) : null), "html", null, true);
                    // line 194
                    echo "</option>
                    ";
                }
                // line 196
                echo "                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['i'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 197
            echo "            </select>

            ";
            // line 199
            $this->loadTemplate("checkbox.twig", "table/search/selection_form.twig", 199)->display(twig_to_array(["html_field_id" => "useRegex", "html_field_name" => "useRegex", "label" => _gettext("Use regular expression"), "checked" => false, "onclick" => false]));
            // line 206
            echo "        </fieldset>
    </fieldset>
";
        } else {
            // line 209
            echo "    ";
            $this->loadTemplate("table/search/form_tag.twig", "table/search/selection_form.twig", 209)->display(twig_to_array(["script_name" => "", "form_id" => "", "db" =>             // line 212
($context["db"] ?? null), "table" =>             // line 213
($context["table"] ?? null), "goto" =>             // line 214
($context["goto"] ?? null)]));
        }
        // line 217
        echo "
";
        // line 219
        echo "    <fieldset class=\"tblFooters\">
        <input class=\"btn btn-primary\" type=\"submit\"
            name=\"";
        // line 221
        echo (((($context["search_type"] ?? null) == "zoom")) ? ("zoom_submit") : ("submit"));
        echo "\"
            ";
        // line 222
        echo (((($context["search_type"] ?? null) == "zoom")) ? ("id=\"inputFormSubmitId\"") : (""));
        echo "
            value=\"";
        // line 223
        echo _gettext("Go");
        echo "\">
    </fieldset>
</form>
<div id=\"sqlqueryresultsouter\"></div>
";
    }

    public function getTemplateName()
    {
        return "table/search/selection_form.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  405 => 223,  401 => 222,  397 => 221,  393 => 219,  390 => 217,  387 => 214,  386 => 213,  385 => 212,  383 => 209,  378 => 206,  376 => 199,  372 => 197,  366 => 196,  362 => 194,  360 => 193,  356 => 192,  354 => 191,  351 => 190,  348 => 189,  344 => 188,  341 => 187,  339 => 186,  335 => 184,  333 => 183,  330 => 182,  327 => 181,  325 => 180,  320 => 177,  318 => 175,  317 => 174,  316 => 173,  314 => 170,  312 => 169,  305 => 164,  303 => 154,  299 => 152,  290 => 149,  285 => 148,  281 => 147,  276 => 145,  273 => 144,  266 => 139,  258 => 134,  255 => 133,  248 => 128,  245 => 127,  243 => 126,  239 => 125,  235 => 123,  228 => 117,  219 => 114,  213 => 112,  209 => 111,  204 => 109,  200 => 107,  198 => 106,  194 => 104,  191 => 102,  189 => 100,  188 => 97,  182 => 93,  180 => 91,  179 => 90,  178 => 89,  177 => 88,  176 => 87,  175 => 86,  174 => 85,  173 => 84,  172 => 83,  168 => 81,  166 => 80,  161 => 77,  159 => 75,  158 => 74,  157 => 73,  155 => 70,  153 => 69,  144 => 63,  135 => 56,  133 => 55,  128 => 52,  123 => 48,  117 => 47,  111 => 44,  106 => 43,  100 => 40,  95 => 39,  92 => 38,  88 => 37,  85 => 36,  83 => 35,  76 => 30,  74 => 29,  69 => 26,  66 => 24,  64 => 23,  63 => 22,  62 => 21,  61 => 20,  60 => 19,  59 => 18,  58 => 17,  57 => 16,  56 => 15,  55 => 14,  52 => 13,  50 => 12,  45 => 9,  43 => 7,  42 => 6,  41 => 5,  39 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/search/selection_form.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\search\\selection_form.twig");
    }
}
