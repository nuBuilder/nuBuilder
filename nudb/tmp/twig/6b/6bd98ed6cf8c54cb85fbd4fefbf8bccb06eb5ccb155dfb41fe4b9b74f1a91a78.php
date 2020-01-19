<?php

/* list/item.twig */
class __TwigTemplate_1599159e4585b9a8073443561149ba86decd093862888252ad8319d66994e1a3 extends Twig_Template
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
        echo "<li";
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
        // line 4
        if (((array_key_exists("url", $context) && twig_test_iterable(($context["url"] ?? null))) &&  !twig_test_empty($this->getAttribute(($context["url"] ?? null), "href", array(), "array")))) {
            // line 5
            echo "        <a";
            if ( !twig_test_empty($this->getAttribute(($context["url"] ?? null), "href", array(), "array"))) {
                echo " href=\"";
                echo $this->getAttribute(($context["url"] ?? null), "href", array(), "array");
                echo "\"";
            }
            // line 6
            if ( !twig_test_empty($this->getAttribute(($context["url"] ?? null), "target", array(), "array"))) {
                echo " target=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["url"] ?? null), "target", array(), "array"), "html", null, true);
                echo "\"";
            }
            // line 7
            if (( !twig_test_empty($this->getAttribute(($context["url"] ?? null), "target", array(), "array")) && ($this->getAttribute(($context["url"] ?? null), "target", array(), "array") == "_blank"))) {
                echo " rel=\"noopener noreferrer\"";
            }
            // line 8
            if ( !twig_test_empty($this->getAttribute(($context["url"] ?? null), "id", array(), "array"))) {
                echo " id=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["url"] ?? null), "id", array(), "array"), "html", null, true);
                echo "\"";
            }
            // line 9
            if ( !twig_test_empty($this->getAttribute(($context["url"] ?? null), "class", array(), "array"))) {
                echo " class=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["url"] ?? null), "class", array(), "array"), "html", null, true);
                echo "\"";
            }
            // line 10
            if ( !twig_test_empty($this->getAttribute(($context["url"] ?? null), "title", array(), "array"))) {
                echo " title=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["url"] ?? null), "title", array(), "array"), "html", null, true);
                echo "\"";
            }
            echo ">
    ";
        }
        // line 12
        echo "        ";
        echo ($context["content"] ?? null);
        echo "
    ";
        // line 13
        if (((array_key_exists("url", $context) && twig_test_iterable(($context["url"] ?? null))) &&  !twig_test_empty($this->getAttribute(($context["url"] ?? null), "href", array(), "array")))) {
            // line 14
            echo "        </a>
    ";
        }
        // line 16
        echo "    ";
        if ( !twig_test_empty(($context["mysql_help_page"] ?? null))) {
            // line 17
            echo "        ";
            echo PhpMyAdmin\Util::showMySQLDocu(($context["mysql_help_page"] ?? null));
            echo "
    ";
        }
        // line 19
        echo "</li>
";
    }

    public function getTemplateName()
    {
        return "list/item.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  95 => 19,  89 => 17,  86 => 16,  82 => 14,  80 => 13,  75 => 12,  66 => 10,  60 => 9,  54 => 8,  50 => 7,  44 => 6,  37 => 5,  35 => 4,  26 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "list/item.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\list\\item.twig");
    }
}
