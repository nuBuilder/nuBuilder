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

/* database/create_table.twig */
class __TwigTemplate_9aedeb695aa1d3d554eb9afe66db542a1a89a1a26c0f4bf199bb0b521a30a541 extends \Twig\Template
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
        echo "<form id=\"create_table_form_minimal\" method=\"post\" action=\"tbl_create.php\" class=\"lock-page\">
    <fieldset>
        <legend>
        ";
        // line 4
        if (PhpMyAdmin\Util::showIcons("ActionLinksMode")) {
            // line 5
            echo PhpMyAdmin\Util::getImage("b_table_add");
        }
        // line 7
        echo "        ";
        echo _gettext("Create table");
        // line 8
        echo "        </legend>
        ";
        // line 9
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null));
        echo "
        <div class=\"formelement\">
            ";
        // line 11
        echo _gettext("Name");
        echo ":
            <input type=\"text\" name=\"table\" maxlength=\"64\" size=\"30\" required=\"required\">
        </div>
        <div class=\"formelement\">
            ";
        // line 15
        echo _gettext("Number of columns");
        echo ":
            <input type=\"number\" min=\"1\" name=\"num_fields\" value=\"4\" required=\"required\">
        </div>
        <div class=\"clearfloat\"></div>
    </fieldset>
    <fieldset class=\"tblFooters\">
        <input class=\"btn btn-primary\" type=\"submit\" value=\"";
        // line 21
        echo _gettext("Go");
        echo "\">
    </fieldset>
</form>
";
    }

    public function getTemplateName()
    {
        return "database/create_table.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  74 => 21,  65 => 15,  58 => 11,  53 => 9,  50 => 8,  47 => 7,  44 => 5,  42 => 4,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/create_table.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\create_table.twig");
    }
}
