<?php

/* console/bookmark_content.twig */
class __TwigTemplate_21b85fc1fa547f78deaacdd0eb6a562a947a5bfa3a4b4c182457c85530a3a729 extends Twig_Template
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
        echo "<div class=\"message welcome\">
    <span>";
        // line 2
        echo twig_escape_filter($this->env, ($context["welcome_message"] ?? null), "html", null, true);
        echo "</span>
</div>
";
        // line 4
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["bookmarks"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["bookmark"]) {
            // line 5
            echo "    <div class=\"message collapsed bookmark\" bookmarkid=\"";
            echo twig_escape_filter($this->env, $this->getAttribute($context["bookmark"], "getId", array(), "method"), "html", null, true);
            echo "\"
        targetdb=\"";
            // line 6
            echo twig_escape_filter($this->env, $this->getAttribute($context["bookmark"], "getDatabase", array(), "method"), "html", null, true);
            echo "\">
        ";
            // line 7
            $this->loadTemplate("console/query_action.twig", "console/bookmark_content.twig", 7)->display(array("parent_div_classes" => "action_content", "content_array" => array(0 => array(0 => "action collapse", 1 => _gettext("Collapse")), 1 => array(0 => "action expand", 1 => _gettext("Expand")), 2 => array(0 => "action requery", 1 => _gettext("Requery")), 3 => array(0 => "action edit_bookmark", 1 => _gettext("Edit")), 4 => array(0 => "action delete_bookmark", 1 => _gettext("Delete")), 5 => array(0 => "text targetdb", 1 => _gettext("Database"), "extraSpan" => $this->getAttribute(            // line 15
$context["bookmark"], "getDatabase", array(), "method")))));
            // line 18
            echo "        <span class=\"bookmark_label";
            echo ((twig_test_empty($this->getAttribute($context["bookmark"], "getUser", array(), "method"))) ? (" shared") : (""));
            echo "\">
            ";
            // line 19
            echo twig_escape_filter($this->env, $this->getAttribute($context["bookmark"], "getLabel", array(), "method"), "html", null, true);
            echo "
        </span>
        <span class=\"query\">
            ";
            // line 22
            echo twig_escape_filter($this->env, $this->getAttribute($context["bookmark"], "getQuery", array(), "method"), "html", null, true);
            echo "
        </span>
    </div>
";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['bookmark'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
    }

    public function getTemplateName()
    {
        return "console/bookmark_content.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  54 => 22,  48 => 19,  43 => 18,  41 => 15,  40 => 7,  36 => 6,  31 => 5,  27 => 4,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "console/bookmark_content.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\console\\bookmark_content.twig");
    }
}
