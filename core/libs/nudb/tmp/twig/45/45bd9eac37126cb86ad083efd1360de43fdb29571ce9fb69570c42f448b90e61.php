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

/* radio_fields.twig */
class __TwigTemplate_3a0b1a3f4a7aa14153b137a1a3960ad510b5844b847224fc2d90eb5c398c2430 extends \Twig\Template
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
        if ( !twig_test_empty(($context["class"] ?? null))) {
            // line 2
            echo "<div class=\"";
            echo twig_escape_filter($this->env, ($context["class"] ?? null), "html", null, true);
            echo "\">
";
        }
        // line 4
        echo "<input type=\"radio\" name=\"";
        echo twig_escape_filter($this->env, ($context["html_field_name"] ?? null), "html", null, true);
        echo "\" id=\"";
        echo ($context["html_field_id"] ?? null);
        echo "\" value=\"";
        echo twig_escape_filter($this->env, ($context["choice_value"] ?? null), "html", null, true);
        echo "\"";
        echo ((($context["checked"] ?? null)) ? (" checked=\"checked\"") : (""));
        echo ">
<label for=\"";
        // line 5
        echo ($context["html_field_id"] ?? null);
        echo "\">";
        echo ((($context["escape_label"] ?? null)) ? (twig_escape_filter($this->env, ($context["choice_label"] ?? null))) : (($context["choice_label"] ?? null)));
        echo "</label>
";
        // line 6
        if (($context["is_line_break"] ?? null)) {
            // line 7
            echo "<br>
";
        }
        // line 9
        if ( !twig_test_empty(($context["class"] ?? null))) {
            // line 10
            echo "</div>
";
        }
    }

    public function getTemplateName()
    {
        return "radio_fields.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  70 => 10,  68 => 9,  64 => 7,  62 => 6,  56 => 5,  45 => 4,  39 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "radio_fields.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\radio_fields.twig");
    }
}
