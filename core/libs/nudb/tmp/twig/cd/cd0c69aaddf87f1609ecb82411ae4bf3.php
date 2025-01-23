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

/* display/results/checkbox_and_links.twig */
class __TwigTemplate_bb7c91d6d0fd358156dc510420a9177d extends Template
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
        if ((($context["position"] ?? null) == "left")) {
            // line 2
            yield "  ";
            if (($context["has_checkbox"] ?? null)) {
                // line 3
                yield "    <td class=\"text-center d-print-none\">
      <input type=\"checkbox\" class=\"multi_checkbox checkall\" id=\"id_rows_to_delete";
                // line 5
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_number"] ?? null), "html", null, true);
                yield "_left\" name=\"rows_to_delete[";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_number"] ?? null), "html", null, true);
                yield "]\" value=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["where_clause"] ?? null), "html", null, true);
                yield "\">
      <input type=\"hidden\" class=\"condition_array\" value=\"";
                // line 6
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["condition"] ?? null), "html", null, true);
                yield "\">
    </td>
  ";
            }
            // line 9
            yield "
  ";
            // line 10
            if ( !Twig\Extension\CoreExtension::testEmpty(CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "url", [], "any", false, false, false, 10))) {
                // line 11
                yield "    <td class=\"text-center d-print-none edit_row_anchor";
                yield (( !CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "clause_is_unique", [], "any", false, false, false, 11)) ? (" nonunique") : (""));
                yield "\">
      <span class=\"text-nowrap\">
        ";
                // line 13
                yield PhpMyAdmin\Html\Generator::linkOrButton(CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "url", [], "any", false, false, false, 13), CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "params", [], "any", false, false, false, 13), CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "string", [], "any", false, false, false, 13));
                yield "
        ";
                // line 14
                if ( !Twig\Extension\CoreExtension::testEmpty(($context["where_clause"] ?? null))) {
                    // line 15
                    yield "          <input type=\"hidden\" class=\"where_clause\" value=\"";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["where_clause"] ?? null), "html", null, true);
                    yield "\">
        ";
                }
                // line 17
                yield "      </span>
    </td>
  ";
            }
            // line 20
            yield "
  ";
            // line 21
            if ( !Twig\Extension\CoreExtension::testEmpty(CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "url", [], "any", false, false, false, 21))) {
                // line 22
                yield "    <td class=\"text-center d-print-none\">
      <span class=\"text-nowrap\">
        ";
                // line 24
                yield PhpMyAdmin\Html\Generator::linkOrButton(CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "url", [], "any", false, false, false, 24), CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "params", [], "any", false, false, false, 24), CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "string", [], "any", false, false, false, 24));
                yield "
        ";
                // line 25
                if ( !Twig\Extension\CoreExtension::testEmpty(($context["where_clause"] ?? null))) {
                    // line 26
                    yield "          <input type=\"hidden\" class=\"where_clause\" value=\"";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["where_clause"] ?? null), "html", null, true);
                    yield "\">
        ";
                }
                // line 28
                yield "      </span>
    </td>
  ";
            }
            // line 31
            yield "
  ";
            // line 32
            if ( !Twig\Extension\CoreExtension::testEmpty(CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "url", [], "any", false, false, false, 32))) {
                // line 33
                yield "    <td class=\"text-center d-print-none";
                yield ((($context["is_ajax"] ?? null)) ? (" ajax") : (""));
                yield "\">
      <span class=\"text-nowrap\">
        ";
                // line 35
                yield PhpMyAdmin\Html\Generator::linkOrButton(CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "url", [], "any", false, false, false, 35), CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "params", [], "any", false, false, false, 35), CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "string", [], "any", false, false, false, 35), ["class" => ("delete_row requireConfirm" . ((($context["is_ajax"] ?? null)) ? (" ajax") : ("")))]);
                yield "
        ";
                // line 36
                if ( !Twig\Extension\CoreExtension::testEmpty(($context["js_conf"] ?? null))) {
                    // line 37
                    yield "          <div class=\"hide\">";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["js_conf"] ?? null), "html", null, true);
                    yield "</div>
        ";
                }
                // line 39
                yield "      </span>
    </td>
  ";
            }
        } elseif ((        // line 42
($context["position"] ?? null) == "right")) {
            // line 43
            yield "  ";
            if ( !Twig\Extension\CoreExtension::testEmpty(CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "url", [], "any", false, false, false, 43))) {
                // line 44
                yield "    <td class=\"text-center d-print-none";
                yield ((($context["is_ajax"] ?? null)) ? (" ajax") : (""));
                yield "\">
      <span class=\"text-nowrap\">
        ";
                // line 46
                yield PhpMyAdmin\Html\Generator::linkOrButton(CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "url", [], "any", false, false, false, 46), CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "params", [], "any", false, false, false, 46), CoreExtension::getAttribute($this->env, $this->source, ($context["delete"] ?? null), "string", [], "any", false, false, false, 46), ["class" => ("delete_row requireConfirm" . ((($context["is_ajax"] ?? null)) ? (" ajax") : ("")))]);
                yield "
        ";
                // line 47
                if ( !Twig\Extension\CoreExtension::testEmpty(($context["js_conf"] ?? null))) {
                    // line 48
                    yield "          <div class=\"hide\">";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["js_conf"] ?? null), "html", null, true);
                    yield "</div>
        ";
                }
                // line 50
                yield "      </span>
    </td>
  ";
            }
            // line 53
            yield "
  ";
            // line 54
            if ( !Twig\Extension\CoreExtension::testEmpty(CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "url", [], "any", false, false, false, 54))) {
                // line 55
                yield "    <td class=\"text-center d-print-none\">
      <span class=\"text-nowrap\">
        ";
                // line 57
                yield PhpMyAdmin\Html\Generator::linkOrButton(CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "url", [], "any", false, false, false, 57), CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "params", [], "any", false, false, false, 57), CoreExtension::getAttribute($this->env, $this->source, ($context["copy"] ?? null), "string", [], "any", false, false, false, 57));
                yield "
        ";
                // line 58
                if ( !Twig\Extension\CoreExtension::testEmpty(($context["where_clause"] ?? null))) {
                    // line 59
                    yield "          <input type=\"hidden\" class=\"where_clause\" value=\"";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["where_clause"] ?? null), "html", null, true);
                    yield "\">
        ";
                }
                // line 61
                yield "      </span>
    </td>
  ";
            }
            // line 64
            yield "
  ";
            // line 65
            if ( !Twig\Extension\CoreExtension::testEmpty(CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "url", [], "any", false, false, false, 65))) {
                // line 66
                yield "    <td class=\"text-center d-print-none edit_row_anchor";
                yield (( !CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "clause_is_unique", [], "any", false, false, false, 66)) ? (" nonunique") : (""));
                yield "\">
      <span class=\"text-nowrap\">
        ";
                // line 68
                yield PhpMyAdmin\Html\Generator::linkOrButton(CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "url", [], "any", false, false, false, 68), CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "params", [], "any", false, false, false, 68), CoreExtension::getAttribute($this->env, $this->source, ($context["edit"] ?? null), "string", [], "any", false, false, false, 68));
                yield "
        ";
                // line 69
                if ( !Twig\Extension\CoreExtension::testEmpty(($context["where_clause"] ?? null))) {
                    // line 70
                    yield "          <input type=\"hidden\" class=\"where_clause\" value=\"";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["where_clause"] ?? null), "html", null, true);
                    yield "\">
        ";
                }
                // line 72
                yield "      </span>
    </td>
  ";
            }
            // line 75
            yield "
  ";
            // line 76
            if (($context["has_checkbox"] ?? null)) {
                // line 77
                yield "    <td class=\"text-center d-print-none\">
      <input type=\"checkbox\" class=\"multi_checkbox checkall\" id=\"id_rows_to_delete";
                // line 79
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_number"] ?? null), "html", null, true);
                yield "_right\" name=\"rows_to_delete[";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_number"] ?? null), "html", null, true);
                yield "]\" value=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["where_clause"] ?? null), "html", null, true);
                yield "\">
      <input type=\"hidden\" class=\"condition_array\" value=\"";
                // line 80
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["condition"] ?? null), "html", null, true);
                yield "\">
    </td>
  ";
            }
        } else {
            // line 84
            yield "  ";
            if (($context["has_checkbox"] ?? null)) {
                // line 85
                yield "    <td class=\"text-center d-print-none\">
      <input type=\"checkbox\" class=\"multi_checkbox checkall\" id=\"id_rows_to_delete";
                // line 87
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_number"] ?? null), "html", null, true);
                yield "_left\" name=\"rows_to_delete[";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["row_number"] ?? null), "html", null, true);
                yield "]\" value=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["where_clause"] ?? null), "html", null, true);
                yield "\">
      <input type=\"hidden\" class=\"condition_array\" value=\"";
                // line 88
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["condition"] ?? null), "html", null, true);
                yield "\">
    </td>
  ";
            }
        }
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "display/results/checkbox_and_links.twig";
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
        return array (  261 => 88,  253 => 87,  250 => 85,  247 => 84,  240 => 80,  232 => 79,  229 => 77,  227 => 76,  224 => 75,  219 => 72,  213 => 70,  211 => 69,  207 => 68,  201 => 66,  199 => 65,  196 => 64,  191 => 61,  185 => 59,  183 => 58,  179 => 57,  175 => 55,  173 => 54,  170 => 53,  165 => 50,  159 => 48,  157 => 47,  153 => 46,  147 => 44,  144 => 43,  142 => 42,  137 => 39,  131 => 37,  129 => 36,  125 => 35,  119 => 33,  117 => 32,  114 => 31,  109 => 28,  103 => 26,  101 => 25,  97 => 24,  93 => 22,  91 => 21,  88 => 20,  83 => 17,  77 => 15,  75 => 14,  71 => 13,  65 => 11,  63 => 10,  60 => 9,  54 => 6,  46 => 5,  43 => 3,  40 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/results/checkbox_and_links.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\display\\results\\checkbox_and_links.twig");
    }
}
