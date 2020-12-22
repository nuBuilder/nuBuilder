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

/* display/export/template_loading.twig */
class __TwigTemplate_7f09bf3d0cda76cccd71c32da56402ae1ae18f91e49375b7760cda37ac22ed61 extends \Twig\Template
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
        echo "<div class=\"exportoptions\" id=\"export_templates\">
    <h3>";
        // line 2
        echo _gettext("Export templates:");
        echo "</h3>

    <div class=\"floatleft\">
        <form method=\"post\" action=\"tbl_export.php\" id=\"newTemplateForm\" class=\"ajax\">
            <h4>";
        // line 6
        echo _gettext("New template:");
        echo "</h4>
            <input type=\"text\" name=\"templateName\" id=\"templateName\"
                maxlength=\"64\" placeholder=\"";
        // line 8
        echo _gettext("Template name");
        echo "\" required>
            <input class=\"btn btn-secondary\" type=\"submit\" name=\"createTemplate\" id=\"createTemplate\"
                value=\"";
        // line 10
        echo _gettext("Create");
        echo "\">
        </form>
    </div>

    <div class=\"floatleft\" style=\"margin-left: 50px;\">
        <form method=\"post\" action=\"tbl_export.php\" id=\"existingTemplatesForm\" class=\"ajax\">
            <h4>";
        // line 16
        echo _gettext("Existing templates:");
        echo "</h4>
            <label for=\"template\">";
        // line 17
        echo _gettext("Template:");
        echo "</label>
            <select name=\"template\" id=\"template\" required>
                ";
        // line 19
        echo ($context["options"] ?? null);
        echo "
            </select>
            <input class=\"btn btn-secondary\" type=\"submit\" name=\"updateTemplate\" id=\"updateTemplate\" value=\"";
        // line 21
        echo _gettext("Update");
        echo "\">
            <input class=\"btn btn-secondary\" type=\"submit\" name=\"deleteTemplate\" id=\"deleteTemplate\" value=\"";
        // line 22
        echo _gettext("Delete");
        echo "\">
        </form>
    </div>

    <div class=\"clearfloat\"></div>
</div>
";
    }

    public function getTemplateName()
    {
        return "display/export/template_loading.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  84 => 22,  80 => 21,  75 => 19,  70 => 17,  66 => 16,  57 => 10,  52 => 8,  47 => 6,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/export/template_loading.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\export\\template_loading.twig");
    }
}
