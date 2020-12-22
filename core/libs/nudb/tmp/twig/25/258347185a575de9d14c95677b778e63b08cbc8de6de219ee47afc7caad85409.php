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

/* display/export/selection.twig */
class __TwigTemplate_fa38e73cc18440a037e34d1bb594822a226ee057a905cb4afd29a6d8b79b39ff extends \Twig\Template
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
        echo "<div class=\"exportoptions\" id=\"databases_and_tables\">
    ";
        // line 2
        if ((($context["export_type"] ?? null) == "server")) {
            // line 3
            echo "        <h3>";
            echo _gettext("Databases:");
            echo "</h3>
    ";
        } elseif ((        // line 4
($context["export_type"] ?? null) == "database")) {
            // line 5
            echo "        <h3>";
            echo _gettext("Tables:");
            echo "</h3>
    ";
        }
        // line 7
        echo "    ";
        if ( !twig_test_empty(($context["multi_values"] ?? null))) {
            // line 8
            echo "        ";
            echo ($context["multi_values"] ?? null);
            echo "
    ";
        }
        // line 10
        echo "</div>
";
    }

    public function getTemplateName()
    {
        return "display/export/selection.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  64 => 10,  58 => 8,  55 => 7,  49 => 5,  47 => 4,  42 => 3,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/export/selection.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\export\\selection.twig");
    }
}
