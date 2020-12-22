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

/* display/export/method.twig */
class __TwigTemplate_f0f7a16e744be95b6e930286e8b91b555f805d0edcfb25452f490c4f7fef6eb9 extends \Twig\Template
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
        if ((($context["export_method"] ?? null) != "custom-no-form")) {
            // line 2
            echo "    <div class=\"exportoptions\" id=\"quick_or_custom\">
        <h3>";
            // line 3
            echo _gettext("Export method:");
            echo "</h3>
        <ul>
            <li>
                <input type=\"radio\" name=\"quick_or_custom\" value=\"quick\" id=\"radio_quick_export\"";
            // line 7
            echo (((($context["export_method"] ?? null) == "quick")) ? (" checked") : (""));
            echo ">
                <label for=\"radio_quick_export\">
                    ";
            // line 9
            echo _gettext("Quick - display only the minimal options");
            // line 10
            echo "                </label>
            </li>

            <li>
                <input type=\"radio\" name=\"quick_or_custom\" value=\"custom\" id=\"radio_custom_export\"";
            // line 15
            echo (((($context["export_method"] ?? null) == "custom")) ? (" checked") : (""));
            echo ">
                <label for=\"radio_custom_export\">
                    ";
            // line 17
            echo _gettext("Custom - display all possible options");
            // line 18
            echo "                </label>
            </li>
        </ul>
    </div>
";
        }
    }

    public function getTemplateName()
    {
        return "display/export/method.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  68 => 18,  66 => 17,  61 => 15,  55 => 10,  53 => 9,  48 => 7,  42 => 3,  39 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/export/method.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\export\\method.twig");
    }
}
