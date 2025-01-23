<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* filter.twig */
class __TwigTemplate_5b99d2041706733036093a10132aedd9 extends Template
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
        yield "<div class=\"card mb-3\" id=\"tableFilter\">
  <div class=\"card-header\">";
yield _gettext("Filters");
        // line 2
        yield "</div>
  <div class=\"card-body row row-cols-lg-auto gy-1 gx-3 align-items-center\">
    <label class=\"col-12 col-form-label\" for=\"filterText\">";
yield _gettext("Containing the word:");
        // line 4
        yield "</label>
    <div class=\"col-12\">
      <input class=\"form-control\" name=\"filterText\" type=\"text\" id=\"filterText\" value=\"";
        // line 6
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["filter_value"] ?? null), "html", null, true);
        yield "\">
    </div>
  </div>
</div>
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "filter.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  51 => 6,  47 => 4,  42 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "filter.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\filter.twig");
    }
}
