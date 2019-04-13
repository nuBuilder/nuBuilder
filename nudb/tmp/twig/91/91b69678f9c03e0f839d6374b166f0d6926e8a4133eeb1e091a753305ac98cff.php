<?php

/* dropdown.twig */
class __TwigTemplate_236a9c5e4119992e26247be63ed05a0e466db99e6ad9ea8ecb4859fba8dd8573 extends Twig_Template
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
        echo "<select name=\"";
        echo twig_escape_filter($this->env, ($context["select_name"] ?? null), "html", null, true);
        echo "\"";
        if ( !twig_test_empty(($context["id"] ?? null))) {
            echo " id=\"";
            echo twig_escape_filter($this->env, ($context["id"] ?? null), "html", null, true);
            echo "\"";
        }
        // line 2
        if ( !twig_test_empty(($context["class"] ?? null))) {
            echo " class=\"";
            echo twig_escape_filter($this->env, ($context["class"] ?? null), "html", null, true);
            echo "\"";
        }
        echo ">
";
        // line 3
        if ( !twig_test_empty(($context["placeholder"] ?? null))) {
            // line 4
            echo "    <option value=\"\" disabled=\"disabled\"";
            // line 5
            if ( !($context["selected"] ?? null)) {
                echo " selected=\"selected\"";
            }
            echo ">";
            echo twig_escape_filter($this->env, ($context["placeholder"] ?? null), "html", null, true);
            echo "</option>
";
        }
        // line 7
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["result_options"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["option"]) {
            // line 8
            echo "<option value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute($context["option"], "value", array(), "array"), "html", null, true);
            echo "\"";
            // line 9
            echo (($this->getAttribute($context["option"], "selected", array(), "array")) ? (" selected=\"selected\"") : (""));
            echo ">";
            echo twig_escape_filter($this->env, $this->getAttribute($context["option"], "label", array(), "array"), "html", null, true);
            echo "</option>
";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['option'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 11
        echo "</select>
";
    }

    public function getTemplateName()
    {
        return "dropdown.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  67 => 11,  57 => 9,  53 => 8,  49 => 7,  40 => 5,  38 => 4,  36 => 3,  28 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "dropdown.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\dropdown.twig");
    }
}
