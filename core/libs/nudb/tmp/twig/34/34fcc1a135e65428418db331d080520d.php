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

/* navigation/tree/path.twig */
class __TwigTemplate_5660251c1e4938e6c42fe05ca982f650 extends Template
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
        yield "<div class='list_container hide'>
  <ul";
        // line 2
        yield ((($context["has_search_results"] ?? null)) ? (" class=\"search_results\"") : (""));
        yield ">
    ";
        // line 3
        yield ($context["list_content"] ?? null);
        yield "
  </ul>

  ";
        // line 6
        if ( !($context["is_tree"] ?? null)) {
            // line 7
            yield "    <span class='hide loaded_db'>";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::urlencode(($context["parent_name"] ?? null)), "html", null, true);
            yield "</span>
    ";
            // line 8
            if (Twig\Extension\CoreExtension::testEmpty(($context["list_content"] ?? null))) {
                // line 9
                yield "      <div>";
yield _gettext("No tables found in database.");
                yield "</div>
    ";
            }
            // line 11
            yield "  ";
        }
        // line 12
        yield "</div>
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "navigation/tree/path.twig";
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
        return array (  69 => 12,  66 => 11,  60 => 9,  58 => 8,  53 => 7,  51 => 6,  45 => 3,  41 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "navigation/tree/path.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\navigation\\tree\\path.twig");
    }
}
