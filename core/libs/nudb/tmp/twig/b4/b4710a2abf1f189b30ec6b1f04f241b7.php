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

/* display/results/comment_for_row.twig */
class __TwigTemplate_af0ae9f6b6513838eb26a18740ff3600 extends Template
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
        if ((CoreExtension::getAttribute($this->env, $this->source, ($context["comments_map"] ?? null), ($context["table_name"] ?? null), [], "array", true, true, false, 1) && CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source,         // line 2
($context["comments_map"] ?? null), ($context["table_name"] ?? null), [], "array", false, true, false, 2), ($context["column_name"] ?? null), [], "array", true, true, false, 2))) {
            // line 3
            yield "    <br><span class=\"tblcomment\" title=\"";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($__internal_compile_0 = (($__internal_compile_1 = ($context["comments_map"] ?? null)) && is_array($__internal_compile_1) || $__internal_compile_1 instanceof ArrayAccess ? ($__internal_compile_1[($context["table_name"] ?? null)] ?? null) : null)) && is_array($__internal_compile_0) || $__internal_compile_0 instanceof ArrayAccess ? ($__internal_compile_0[($context["column_name"] ?? null)] ?? null) : null), "html", null, true);
            yield "\">
        ";
            // line 4
            if ((Twig\Extension\CoreExtension::length($this->env->getCharset(), (($__internal_compile_2 = (($__internal_compile_3 = ($context["comments_map"] ?? null)) && is_array($__internal_compile_3) || $__internal_compile_3 instanceof ArrayAccess ? ($__internal_compile_3[($context["table_name"] ?? null)] ?? null) : null)) && is_array($__internal_compile_2) || $__internal_compile_2 instanceof ArrayAccess ? ($__internal_compile_2[($context["column_name"] ?? null)] ?? null) : null)) > ($context["limit_chars"] ?? null))) {
                // line 5
                yield "            ";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::slice($this->env->getCharset(), (($__internal_compile_4 = (($__internal_compile_5 = ($context["comments_map"] ?? null)) && is_array($__internal_compile_5) || $__internal_compile_5 instanceof ArrayAccess ? ($__internal_compile_5[($context["table_name"] ?? null)] ?? null) : null)) && is_array($__internal_compile_4) || $__internal_compile_4 instanceof ArrayAccess ? ($__internal_compile_4[($context["column_name"] ?? null)] ?? null) : null), 0, ($context["limit_chars"] ?? null)), "html", null, true);
                yield "…
        ";
            } else {
                // line 7
                yield "            ";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($__internal_compile_6 = (($__internal_compile_7 = ($context["comments_map"] ?? null)) && is_array($__internal_compile_7) || $__internal_compile_7 instanceof ArrayAccess ? ($__internal_compile_7[($context["table_name"] ?? null)] ?? null) : null)) && is_array($__internal_compile_6) || $__internal_compile_6 instanceof ArrayAccess ? ($__internal_compile_6[($context["column_name"] ?? null)] ?? null) : null), "html", null, true);
                yield "
        ";
            }
            // line 9
            yield "    </span>
";
        }
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "display/results/comment_for_row.twig";
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
        return array (  60 => 9,  54 => 7,  48 => 5,  46 => 4,  41 => 3,  39 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/results/comment_for_row.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\display\\results\\comment_for_row.twig");
    }
}
