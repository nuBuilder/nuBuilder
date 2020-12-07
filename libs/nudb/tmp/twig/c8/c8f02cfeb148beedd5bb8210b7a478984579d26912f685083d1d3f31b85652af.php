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

/* table/structure/action_row_in_structure_table.twig */
class __TwigTemplate_782584e0e3634156399ccad939a7f9dc4ead4270b1275c8ce92985541bcee75d extends \Twig\Template
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
        echo "<li class=\"";
        echo twig_escape_filter($this->env, ($context["class"] ?? null), "html", null, true);
        echo "\">
";
        // line 2
        if (((((($context["type"] ?? null) == "text") || (        // line 3
($context["type"] ?? null) == "blob")) || (        // line 4
($context["tbl_storage_engine"] ?? null) == "ARCHIVE")) ||         // line 5
($context["has_field"] ?? null))) {
            // line 6
            echo "    ";
            echo (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["titles"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4[("No" . ($context["action"] ?? null))] ?? null) : null);
            echo "
";
        } else {
            // line 8
            echo "    <a rel=\"samepage\" class=\"ajax add_key print_ignore";
            // line 9
            if (($context["has_link_class"] ?? null)) {
                // line 10
                echo "            add_primary_key_anchor";
            } elseif ((            // line 11
($context["action"] ?? null) == "Index")) {
                // line 12
                echo "            add_index_anchor";
            } elseif ((            // line 13
($context["action"] ?? null) == "Unique")) {
                // line 14
                echo "            add_unique_anchor";
            } elseif ((            // line 15
($context["action"] ?? null) == "Spatial")) {
                // line 16
                echo "            add_spatial_anchor";
            }
            // line 17
            echo "\" href=\"tbl_structure.php\" data-post=\"";
            echo ($context["url_query"] ?? null);
            // line 18
            echo "&amp;add_key=1&amp;sql_query=";
            // line 19
            echo twig_escape_filter($this->env, twig_urlencode_filter(((((((("ALTER TABLE " . PhpMyAdmin\Util::backquote(            // line 20
($context["table"] ?? null))) . ((            // line 21
($context["is_primary"] ?? null)) ? (((($context["primary"] ?? null)) ? (" DROP PRIMARY KEY,") : (""))) : (""))) . " ") .             // line 23
($context["syntax"] ?? null)) . "(") . PhpMyAdmin\Util::backquote((($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 =             // line 25
($context["row"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144["Field"] ?? null) : null))) . ");")), "html", null, true);
            // line 27
            echo "&amp;message_to_show=";
            echo twig_escape_filter($this->env, twig_urlencode_filter(sprintf(($context["message"] ?? null), twig_escape_filter($this->env, (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = ($context["row"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b["Field"] ?? null) : null)))), "html", null, true);
            echo "\">
        ";
            // line 28
            echo (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = ($context["titles"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002[($context["action"] ?? null)] ?? null) : null);
            echo "
    </a>
";
        }
        // line 31
        echo "</li>
";
    }

    public function getTemplateName()
    {
        return "table/structure/action_row_in_structure_table.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  94 => 31,  88 => 28,  83 => 27,  81 => 25,  80 => 23,  79 => 21,  78 => 20,  77 => 19,  75 => 18,  72 => 17,  69 => 16,  67 => 15,  65 => 14,  63 => 13,  61 => 12,  59 => 11,  57 => 10,  55 => 9,  53 => 8,  47 => 6,  45 => 5,  44 => 4,  43 => 3,  42 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/structure/action_row_in_structure_table.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\action_row_in_structure_table.twig");
    }
}
