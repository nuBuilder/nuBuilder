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

/* select_lang.twig */
class __TwigTemplate_d7a1b3326acf0161dd59493570377457b288f9df499ac5452731ffa7b4c83d76 extends \Twig\Template
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
        echo "    <form method=\"get\" action=\"index.php\" class=\"disableAjax\">
    ";
        // line 2
        echo PhpMyAdmin\Url::getHiddenInputs(($context["_form_params"] ?? null));
        echo "

    ";
        // line 4
        if (($context["use_fieldset"] ?? null)) {
            // line 5
            echo "        <fieldset>
            <legend lang=\"en\" dir=\"ltr\">";
            // line 6
            echo ($context["language_title"] ?? null);
            echo "</legend>
    ";
        } else {
            // line 8
            echo "        <bdo lang=\"en\" dir=\"ltr\">
            <label for=\"sel-lang\">";
            // line 9
            echo ($context["language_title"] ?? null);
            echo "</label>
        </bdo>
    ";
        }
        // line 12
        echo "
    <select name=\"lang\" class=\"autosubmit\" lang=\"en\" dir=\"ltr\" id=\"sel-lang\">

    ";
        // line 15
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["available_languages"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["language"]) {
            // line 16
            echo "        ";
            // line 17
            echo "        <option value=\"";
            echo twig_escape_filter($this->env, twig_lower_filter($this->env, twig_get_attribute($this->env, $this->source, $context["language"], "getCode", [], "method", false, false, false, 17)), "html", null, true);
            echo "\"";
            // line 18
            if (twig_get_attribute($this->env, $this->source, $context["language"], "isActive", [], "method", false, false, false, 18)) {
                // line 19
                echo "                selected=\"selected\"";
            }
            // line 21
            echo ">
        ";
            // line 22
            echo twig_get_attribute($this->env, $this->source, $context["language"], "getName", [], "method", false, false, false, 22);
            echo "
        </option>
    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['language'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 25
        echo "
    </select>

    ";
        // line 28
        if (($context["use_fieldset"] ?? null)) {
            // line 29
            echo "        </fieldset>
    ";
        }
        // line 31
        echo "
    </form>
";
    }

    public function getTemplateName()
    {
        return "select_lang.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  107 => 31,  103 => 29,  101 => 28,  96 => 25,  87 => 22,  84 => 21,  81 => 19,  79 => 18,  75 => 17,  73 => 16,  69 => 15,  64 => 12,  58 => 9,  55 => 8,  50 => 6,  47 => 5,  45 => 4,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "select_lang.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\select_lang.twig");
    }
}
