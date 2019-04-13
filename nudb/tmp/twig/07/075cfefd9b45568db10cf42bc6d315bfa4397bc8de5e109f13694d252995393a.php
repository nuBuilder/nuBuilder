<?php

/* table/structure/optional_action_links.twig */
class __TwigTemplate_373895ce653f1f4517e877b66fab80c4f2bdb56a297413c42d12556dd6d0d478 extends Twig_Template
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
        echo "<a href=\"#\" id=\"printView\">";
        echo PhpMyAdmin\Util::getIcon("b_print", _gettext("Print"), true);
        echo "</a>
";
        // line 2
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 3
            echo "    <a href=\"sql.php\" data-post=\"";
            echo ($context["url_query"] ?? null);
            echo "&amp;session_max_rows=all&amp;sql_query=";
            // line 4
            echo twig_escape_filter($this->env, twig_urlencode_filter((("SELECT * FROM " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " PROCEDURE ANALYSE()")), "html", null, true);
            // line 5
            echo "\" style=\"margin-right: 0;\">
        ";
            // line 6
            echo PhpMyAdmin\Util::getIcon("b_tblanalyse", _gettext("Propose table structure"), true);
            // line 10
            echo "
    </a>
    ";
            // line 12
            echo PhpMyAdmin\Util::showMySQLDocu("procedure_analyse");
            echo "
    ";
            // line 13
            if (($context["is_active"] ?? null)) {
                // line 14
                echo "        <a href=\"tbl_tracking.php";
                echo ($context["url_query"] ?? null);
                echo "\">
            ";
                // line 15
                echo PhpMyAdmin\Util::getIcon("eye", _gettext("Track table"), true);
                echo "
        </a>
    ";
            }
            // line 18
            echo "    <a href=\"#\" id=\"move_columns_anchor\">
        ";
            // line 19
            echo PhpMyAdmin\Util::getIcon("b_move", _gettext("Move columns"), true);
            echo "
    </a>
    <a href=\"normalization.php";
            // line 21
            echo ($context["url_query"] ?? null);
            echo "\">
        ";
            // line 22
            echo PhpMyAdmin\Util::getIcon("normalize", _gettext("Normalize"), true);
            echo "
    </a>
";
        }
        // line 25
        if ((($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 26
            echo "    ";
            if (($context["is_active"] ?? null)) {
                // line 27
                echo "        <a href=\"tbl_tracking.php";
                echo ($context["url_query"] ?? null);
                echo "\">
            ";
                // line 28
                echo PhpMyAdmin\Util::getIcon("eye", _gettext("Track view"), true);
                echo "
        </a>
    ";
            }
        }
    }

    public function getTemplateName()
    {
        return "table/structure/optional_action_links.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  86 => 28,  81 => 27,  78 => 26,  76 => 25,  70 => 22,  66 => 21,  61 => 19,  58 => 18,  52 => 15,  47 => 14,  45 => 13,  41 => 12,  37 => 10,  35 => 6,  32 => 5,  30 => 4,  26 => 3,  24 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/optional_action_links.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\optional_action_links.twig");
    }
}
