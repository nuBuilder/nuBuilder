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

/* database/structure/index.twig */
class __TwigTemplate_c994c11beb1ec238bd713b28ac5cf440 extends Template
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
        $context['_parent'] = $context;
        $context['_seq'] = CoreExtension::ensureTraversable($this->env->getRuntime('PhpMyAdmin\FlashMessages')->getMessages());
        foreach ($context['_seq'] as $context["flash_key"] => $context["flash_messages"]) {
            // line 2
            yield "  ";
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable($context["flash_messages"]);
            foreach ($context['_seq'] as $context["_key"] => $context["flash_message"]) {
                // line 3
                yield "    <div class=\"alert alert-";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["flash_key"], "html", null, true);
                yield "\" role=\"alert\">
      ";
                // line 4
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["flash_message"], "html", null, true);
                yield "
    </div>
  ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['flash_message'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['flash_key'], $context['flash_messages'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 8
        yield "
";
        // line 9
        if (($context["has_tables"] ?? null)) {
            // line 10
            yield "  <div id=\"tableslistcontainer\">
    ";
            // line 11
            yield ($context["list_navigator_html"] ?? null);
            yield "

    ";
            // line 13
            yield ($context["table_list_html"] ?? null);
            yield "

    ";
            // line 15
            yield ($context["list_navigator_html"] ?? null);
            yield "
  </div>
  <hr>
  <p class=\"d-print-none\">
    <button type=\"button\" class=\"btn btn-link p-0 jsPrintButton\">";
            // line 19
            yield PhpMyAdmin\Html\Generator::getIcon("b_print", _gettext("Print"), true);
            yield "</button>
    <a href=\"";
            // line 20
            yield PhpMyAdmin\Url::getFromRoute("/database/data-dictionary", ["db" => ($context["database"] ?? null), "goto" => PhpMyAdmin\Url::getFromRoute("/database/structure")]);
            yield "\">
      ";
            // line 21
            yield PhpMyAdmin\Html\Generator::getIcon("b_tblanalyse", _gettext("Data dictionary"), true);
            yield "
    </a>
  </p>
";
        } else {
            // line 25
            yield "  ";
            yield $this->env->getFilter('notice')->getCallable()(_gettext("No tables found in database."));
            yield "
";
        }
        // line 27
        yield "
";
        // line 28
        if ( !($context["is_system_schema"] ?? null)) {
            // line 29
            yield "  ";
            yield ($context["create_table_html"] ?? null);
            yield "
";
        }
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/structure/index.twig";
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
        return array (  116 => 29,  114 => 28,  111 => 27,  105 => 25,  98 => 21,  94 => 20,  90 => 19,  83 => 15,  78 => 13,  73 => 11,  70 => 10,  68 => 9,  65 => 8,  52 => 4,  47 => 3,  42 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/index.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\structure\\index.twig");
    }
}
