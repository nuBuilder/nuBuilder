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

/* sql/no_results_returned.twig */
class __TwigTemplate_445e6ec6d89423c25a607cddf9d8c36d extends Template
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
        yield ($context["message"] ?? null);
        yield "

";
        // line 3
        yield ($context["sql_query_results_table"] ?? null);
        yield "

";
        // line 5
        yield ($context["profiling_chart"] ?? null);
        yield "

";
        // line 7
        if ( !($context["is_procedure"] ?? null)) {
            // line 8
            yield "  <fieldset class=\"pma-fieldset d-print-none\">
    <legend>";
yield _gettext("Query results operations");
            // line 9
            yield "</legend>
    <span>
      ";
            // line 11
            yield PhpMyAdmin\Html\Generator::linkOrButton(PhpMyAdmin\Url::getFromRoute("/view/create"), ["db" =>             // line 13
($context["db"] ?? null), "table" => ($context["table"] ?? null), "printview" => "1", "sql_query" => ($context["sql_query"] ?? null)], PhpMyAdmin\Html\Generator::getIcon("b_view_add", _gettext("Create view"), true), ["class" => "create_view ajax btn"]);
            // line 16
            yield "
    </span>
  </fieldset>
";
        }
        // line 20
        yield "
";
        // line 21
        yield ($context["bookmark"] ?? null);
        yield "

";
        // line 23
        yield Twig\Extension\CoreExtension::include($this->env, $context, "modals/create_view.twig");
        yield "
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "sql/no_results_returned.twig";
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
        return array (  80 => 23,  75 => 21,  72 => 20,  66 => 16,  64 => 13,  63 => 11,  59 => 9,  55 => 8,  53 => 7,  48 => 5,  43 => 3,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "sql/no_results_returned.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\sql\\no_results_returned.twig");
    }
}
