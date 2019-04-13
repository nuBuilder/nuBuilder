<?php

/* table/structure/check_all_table_column.twig */
class __TwigTemplate_463c84d8e77a4866798ca666efb2b8abf9dab673d6e39a2b557ff69f6cf2f844 extends Twig_Template
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
        echo "<div class=\"print_ignore\">
    ";
        // line 2
        $this->loadTemplate("select_all.twig", "table/structure/check_all_table_column.twig", 2)->display(array("pma_theme_image" =>         // line 3
($context["pma_theme_image"] ?? null), "text_dir" =>         // line 4
($context["text_dir"] ?? null), "form_name" => "fieldsForm"));
        // line 7
        echo "
    ";
        // line 8
        echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Browse"), "b_browse", "browse");
        // line 14
        echo "

    ";
        // line 16
        if (( !($context["tbl_is_view"] ?? null) &&  !($context["db_is_system_schema"] ?? null))) {
            // line 17
            echo "        ";
            echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit change_columns_anchor ajax", _gettext("Change"), "b_edit", "change");
            // line 23
            echo "
        ";
            // line 24
            echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Drop"), "b_drop", "drop");
            // line 30
            echo "

        ";
            // line 32
            if ((($context["tbl_storage_engine"] ?? null) != "ARCHIVE")) {
                // line 33
                echo "            ";
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Primary"), "b_primary", "primary");
                // line 39
                echo "
            ";
                // line 40
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Unique"), "b_unique", "unique");
                // line 46
                echo "
            ";
                // line 47
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Index"), "b_index", "index");
                // line 53
                echo "
            ";
                // line 54
                echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Fulltext"), "b_ftext", "ftext");
                // line 60
                echo "

            ";
                // line 62
                if (( !twig_test_empty(($context["tbl_storage_engine"] ?? null)) && (((                // line 63
($context["tbl_storage_engine"] ?? null) == "MYISAM") || (                // line 64
($context["tbl_storage_engine"] ?? null) == "ARIA")) || (                // line 65
($context["tbl_storage_engine"] ?? null) == "MARIA")))) {
                    // line 66
                    echo "                ";
                    echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Fulltext"), "b_ftext", "ftext");
                    // line 72
                    echo "
            ";
                }
                // line 74
                echo "
            ";
                // line 75
                if (($context["central_columns_work"] ?? null)) {
                    // line 76
                    echo "                ";
                    echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Add to central columns"), "centralColumns_add", "add_to_central_columns");
                    // line 82
                    echo "
                ";
                    // line 83
                    echo PhpMyAdmin\Util::getButtonOrImage("submit_mult", "mult_submit", _gettext("Remove from central columns"), "centralColumns_delete", "remove_from_central_columns");
                    // line 89
                    echo "
            ";
                }
                // line 91
                echo "        ";
            }
            // line 92
            echo "    ";
        }
        // line 93
        echo "</div>
";
    }

    public function getTemplateName()
    {
        return "table/structure/check_all_table_column.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  108 => 93,  105 => 92,  102 => 91,  98 => 89,  96 => 83,  93 => 82,  90 => 76,  88 => 75,  85 => 74,  81 => 72,  78 => 66,  76 => 65,  75 => 64,  74 => 63,  73 => 62,  69 => 60,  67 => 54,  64 => 53,  62 => 47,  59 => 46,  57 => 40,  54 => 39,  51 => 33,  49 => 32,  45 => 30,  43 => 24,  40 => 23,  37 => 17,  35 => 16,  31 => 14,  29 => 8,  26 => 7,  24 => 4,  23 => 3,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/check_all_table_column.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\check_all_table_column.twig");
    }
}
