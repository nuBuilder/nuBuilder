<?php

/* table/structure/table_structure_row.twig */
class __TwigTemplate_fc478aabd82e70d810df8f564b01ad281deb421ff1eb7be4226f122c35c34c5b extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<td class=\"center print_ignore\">
    <input type=\"checkbox\" class=\"checkall\" name=\"selected_fld[]\" value=\"";
        // line 2
        echo twig_escape_filter($this->env, $this->getAttribute(($context["row"] ?? null), "Field", array(), "array"), "html", null, true);
        echo "\" id=\"checkbox_row_";
        echo twig_escape_filter($this->env, ($context["rownum"] ?? null), "html", null, true);
        echo "\"/>
</td>
<td class=\"right\">";
        // line 4
        echo twig_escape_filter($this->env, ($context["rownum"] ?? null), "html", null, true);
        echo "</td>
<th class=\"nowrap\">
    <label for=\"checkbox_row_";
        // line 6
        echo twig_escape_filter($this->env, ($context["rownum"] ?? null), "html", null, true);
        echo "\">
        ";
        // line 7
        echo ($context["displayed_field_name"] ?? null);
        echo "
    </label>
</th>
<td ";
        // line 10
        echo twig_escape_filter($this->env, ($context["type_nowrap"] ?? null), "html", null, true);
        echo ">
    <bdo dir=\"ltr\" lang=\"en\">
        ";
        // line 12
        echo $this->getAttribute(($context["extracted_columnspec"] ?? null), "displayed_type", array(), "array");
        echo "
        ";
        // line 13
        if ((((($context["relation_commwork"] ?? null) && ($context["relation_mimework"] ?? null)) && ($context["browse_mime"] ?? null)) && $this->getAttribute($this->getAttribute(        // line 14
($context["mime_map"] ?? null), $this->getAttribute(($context["row"] ?? null), "Field", array(), "array"), array(), "array", false, true), "mimetype", array(), "array", true, true))) {
            // line 15
            echo "            <br />MIME: ";
            echo twig_escape_filter($this->env, twig_lower_filter($this->env, twig_replace_filter($this->getAttribute($this->getAttribute(($context["mime_map"] ?? null), $this->getAttribute(($context["row"] ?? null), "Field", array(), "array"), array(), "array"), "mimetype", array(), "array"), array("_" => "/"))), "html", null, true);
            echo "
        ";
        }
        // line 17
        echo "    </bdo>
</td>
<td>
";
        // line 20
        if ( !twig_test_empty(($context["field_charset"] ?? null))) {
            // line 21
            echo "    <dfn title=\"";
            echo twig_escape_filter($this->env, PhpMyAdmin\Charsets::getCollationDescr(($context["field_charset"] ?? null)), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, ($context["field_charset"] ?? null), "html", null, true);
            echo "</dfn>
";
        }
        // line 23
        echo "</td>
<td class=\"column_attribute nowrap\">";
        // line 24
        echo twig_escape_filter($this->env, ($context["attribute"] ?? null), "html", null, true);
        echo "</td>
<td>";
        // line 25
        echo twig_escape_filter($this->env, ((($this->getAttribute(($context["row"] ?? null), "Null", array(), "array") == "YES")) ? (_gettext("Yes")) : (_gettext("No"))), "html", null, true);
        echo "</td>
<td class=\"nowrap\">
    ";
        // line 27
        if ( !(null === $this->getAttribute(($context["row"] ?? null), "Default", array(), "array"))) {
            // line 28
            echo "        ";
            if (($this->getAttribute(($context["extracted_columnspec"] ?? null), "type", array(), "array") == "bit")) {
                // line 29
                echo "            ";
                echo twig_escape_filter($this->env, PhpMyAdmin\Util::convertBitDefaultValue($this->getAttribute(($context["row"] ?? null), "Default", array(), "array")), "html", null, true);
                echo "
        ";
            } else {
                // line 31
                echo "            ";
                echo $this->getAttribute(($context["row"] ?? null), "Default", array(), "array");
                echo "
        ";
            }
            // line 33
            echo "    ";
        } else {
            // line 34
            echo "        <em>";
            echo _pgettext(            "None for default", "None");
            echo "</em>
    ";
        }
        // line 36
        echo "</td>
";
        // line 37
        if (($context["show_column_comments"] ?? null)) {
            // line 38
            echo "    <td>
        ";
            // line 39
            echo twig_escape_filter($this->env, ($context["comments"] ?? null), "html", null, true);
            echo "
    </td>
";
        }
        // line 42
        echo "<td class=\"nowrap\">";
        echo twig_escape_filter($this->env, twig_upper_filter($this->env, $this->getAttribute(($context["row"] ?? null), "Extra", array(), "array")), "html", null, true);
        echo "</td>
";
        // line 43
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 44
            echo "    <td class=\"edit center print_ignore\">
        <a class=\"change_column_anchor ajax\" href=\"tbl_structure.php";
            // line 46
            echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
            echo "&amp;field=";
            echo twig_escape_filter($this->env, twig_urlencode_filter($this->getAttribute(($context["row"] ?? null), "Field", array(), "array")), "html", null, true);
            echo "&amp;change_column=1\">
            ";
            // line 47
            echo $this->getAttribute(($context["titles"] ?? null), "Change", array(), "array");
            echo "
        </a>
    </td>
    <td class=\"drop center print_ignore\">
        <a class=\"drop_column_anchor ajax\" href=\"sql.php\" data-post=\"";
            // line 51
            echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
            echo "&amp;sql_query=";
            // line 52
            echo twig_escape_filter($this->env, twig_urlencode_filter((((("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " DROP ") . PhpMyAdmin\Util::backquote($this->getAttribute(            // line 53
($context["row"] ?? null), "Field", array(), "array"))) . ";")), "html", null, true);
            // line 54
            echo "&amp;dropped_column=";
            echo twig_escape_filter($this->env, twig_urlencode_filter($this->getAttribute(($context["row"] ?? null), "Field", array(), "array")), "html", null, true);
            echo "&amp;purge=1&amp;message_to_show=";
            // line 55
            echo twig_escape_filter($this->env, twig_urlencode_filter(sprintf(_gettext("Column %s has been dropped."), twig_escape_filter($this->env, $this->getAttribute(($context["row"] ?? null), "Field", array(), "array")))), "html", null, true);
            echo "\">
            ";
            // line 56
            echo $this->getAttribute(($context["titles"] ?? null), "Drop", array(), "array");
            echo "
        </a>
    </td>
";
        }
    }

    public function getTemplateName()
    {
        return "table/structure/table_structure_row.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  166 => 56,  162 => 55,  158 => 54,  156 => 53,  155 => 52,  152 => 51,  145 => 47,  139 => 46,  136 => 44,  134 => 43,  129 => 42,  123 => 39,  120 => 38,  118 => 37,  115 => 36,  109 => 34,  106 => 33,  100 => 31,  94 => 29,  91 => 28,  89 => 27,  84 => 25,  80 => 24,  77 => 23,  69 => 21,  67 => 20,  62 => 17,  56 => 15,  54 => 14,  53 => 13,  49 => 12,  44 => 10,  38 => 7,  34 => 6,  29 => 4,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/table_structure_row.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\table_structure_row.twig");
    }
}
