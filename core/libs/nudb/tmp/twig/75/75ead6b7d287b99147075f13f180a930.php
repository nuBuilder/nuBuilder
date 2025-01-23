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

/* database/export/index.twig */
class __TwigTemplate_35896e516ff6fce6ec770d9443edaac3 extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'selection_options' => [$this, 'block_selection_options'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "export.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 60
        $context["filename_hint"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
            // line 61
            yield "  ";
yield _gettext("@SERVER@ will become the server name and @DATABASE@ will become the database name.");
            return; yield '';
        })())) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 1
        $this->parent = $this->loadTemplate("export.twig", "database/export/index.twig", 1);
        yield from $this->parent->unwrap()->yield($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        yield "  ";
        if ((($context["export_type"] ?? null) == "raw")) {
            // line 5
            yield "    ";
// l10n: A query that the user has written freely
yield _gettext("Exporting a raw query");
            // line 6
            yield "  ";
        } else {
            // line 7
            yield "    ";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::sprintf(_gettext("Exporting tables from \"%s\" database"), ($context["db"] ?? null)), "html", null, true);
            yield "
  ";
        }
        return; yield '';
    }

    // line 11
    public function block_selection_options($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 12
        yield "  ";
        if ((($context["export_type"] ?? null) != "raw")) {
            // line 13
            yield "    <div class=\"card mb-3\" id=\"databases_and_tables\">
      <div class=\"card-header\">";
yield _gettext("Tables:");
            // line 14
            yield "</div>
      <div class=\"card-body\" style=\"overflow-y: scroll; max-height: 20em;\">
        <input type=\"hidden\" name=\"structure_or_data_forced\" value=\"";
            // line 16
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["structure_or_data_forced"] ?? null), "html", null, true);
            yield "\">

        <table class=\"table table-sm table-striped table-hover export_table_select\">
          <thead>
            <tr>
              <th></th>
              <th>";
yield _gettext("Tables");
            // line 22
            yield "</th>
              <th class=\"export_structure text-center\">";
yield _gettext("Structure");
            // line 23
            yield "</th>
              <th class=\"export_data text-center\">";
yield _gettext("Data");
            // line 24
            yield "</th>
            </tr>
            <tr>
              <td></td>
              <td class=\"align-middle\">";
yield _gettext("Select all");
            // line 28
            yield "</td>
              <td class=\"export_structure text-center\">
                <input type=\"checkbox\" id=\"table_structure_all\" aria-label=\"";
yield _gettext("Export the structure of all tables.");
            // line 30
            yield "\">
              </td>
              <td class=\"export_data text-center\">
                <input type=\"checkbox\" id=\"table_data_all\" aria-label=\"";
yield _gettext("Export the data of all tables.");
            // line 33
            yield "\">
              </td>
            </tr>
          </thead>

          <tbody>
            ";
            // line 39
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable(($context["tables"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["each_table"]) {
                // line 40
                yield "              <tr class=\"marked\">
                <td>
                  <input class=\"checkall\" type=\"checkbox\" name=\"table_select[]\" value=\"";
                // line 42
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 42), "html", null, true);
                yield "\"";
                yield ((CoreExtension::getAttribute($this->env, $this->source, $context["each_table"], "is_checked_select", [], "any", false, false, false, 42)) ? (" checked") : (""));
                yield ">
                </td>
                <td class=\"align-middle text-nowrap\">";
                // line 44
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 44), "html", null, true);
                yield "</td>
                <td class=\"export_structure text-center\">
                  <input type=\"checkbox\" name=\"table_structure[]\" value=\"";
                // line 46
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 46), "html", null, true);
                yield "\"";
                yield ((CoreExtension::getAttribute($this->env, $this->source, $context["each_table"], "is_checked_structure", [], "any", false, false, false, 46)) ? (" checked") : (""));
                yield ">
                </td>
                <td class=\"export_data text-center\">
                  <input type=\"checkbox\" name=\"table_data[]\" value=\"";
                // line 49
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 49), "html", null, true);
                yield "\"";
                yield ((CoreExtension::getAttribute($this->env, $this->source, $context["each_table"], "is_checked_data", [], "any", false, false, false, 49)) ? (" checked") : (""));
                yield ">
                </td>
              </tr>
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['each_table'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 53
            yield "          </tbody>
        </table>
      </div>
    </div>
  ";
        }
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/export/index.twig";
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
        return array (  178 => 53,  166 => 49,  158 => 46,  153 => 44,  146 => 42,  142 => 40,  138 => 39,  130 => 33,  124 => 30,  119 => 28,  112 => 24,  108 => 23,  104 => 22,  94 => 16,  90 => 14,  86 => 13,  83 => 12,  79 => 11,  70 => 7,  67 => 6,  63 => 5,  60 => 4,  56 => 3,  51 => 1,  46 => 61,  44 => 60,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/export/index.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\export\\index.twig");
    }
}
