<?php

/* config/form_display/fieldset_top.twig */
class __TwigTemplate_980fca8f8ea4981cdb3082e803138e3f89f456af18693d14c65261917611235f extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<fieldset";
        // line 2
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["attributes"] ?? null));
        foreach ($context['_seq'] as $context["key"] => $context["value"]) {
            // line 3
            echo " ";
            echo twig_escape_filter($this->env, $context["key"], "html", null, true);
            echo "=\"";
            echo twig_escape_filter($this->env, $context["value"], "html", null, true);
            echo "\"";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 4
        echo ">
<legend>";
        // line 5
        echo twig_escape_filter($this->env, ($context["title"] ?? null), "html", null, true);
        echo "</legend>
";
        // line 6
        if ( !twig_test_empty(($context["description"] ?? null))) {
            // line 7
            echo "    <p>";
            echo twig_escape_filter($this->env, ($context["description"] ?? null), "html", null, true);
            echo "</p>
";
        }
        // line 10
        if ((twig_test_iterable(($context["errors"] ?? null)) && (twig_length_filter($this->env, ($context["errors"] ?? null)) > 0))) {
            // line 11
            echo "    <dl class=\"errors\">
        ";
            // line 12
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["errors"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["error"]) {
                // line 13
                echo "            <dd>";
                echo twig_escape_filter($this->env, $context["error"], "html", null, true);
                echo "</dd>
        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['error'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 15
            echo "    </dl>
";
        }
        // line 17
        echo "<table width=\"100%\" cellspacing=\"0\">
";
    }

    public function getTemplateName()
    {
        return "config/form_display/fieldset_top.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  72 => 17,  68 => 15,  59 => 13,  55 => 12,  52 => 11,  50 => 10,  44 => 7,  42 => 6,  38 => 5,  35 => 4,  25 => 3,  21 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "config/form_display/fieldset_top.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\config\\form_display\\fieldset_top.twig");
    }
}
