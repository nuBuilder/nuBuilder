<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* console/bookmark_content.twig */
class __TwigTemplate_e3d5c7f08730903f1957436b0ee803e2690628d6d987a95dc8be95ccc707b789 extends \Twig\Template
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
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getId", [], "method", false, false, false, 5), "html", null, true);
            echo "\"
        targetdb=\"";
            // line 6
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getDatabase", [], "method", false, false, false, 6), "html", null, true);
            echo "\">
        ";
            // line 7
            $this->loadTemplate("console/query_action.twig", "console/bookmark_content.twig", 7)->display(twig_to_array(["parent_div_classes" => "action_content", "content_array" => [0 => [0 => "action collapse", 1 => _gettext("Collapse")], 1 => [0 => "action expand", 1 => _gettext("Expand")], 2 => [0 => "action requery", 1 => _gettext("Requery")], 3 => [0 => "action edit_bookmark", 1 => _gettext("Edit")], 4 => [0 => "action delete_bookmark", 1 => _gettext("Delete")], 5 => [0 => "text targetdb", 1 => _gettext("Database"), "extraSpan" => twig_get_attribute($this->env, $this->source,             // line 15
$context["bookmark"], "getDatabase", [], "method", false, false, false, 15)]]]));
            // line 18
            echo "        <span class=\"bookmark_label";
            echo ((twig_test_empty(twig_get_attribute($this->env, $this->source, $context["bookmark"], "getUser", [], "method", false, false, false, 18))) ? (" shared") : (""));
            echo "\">
            ";
            // line 19
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getLabel", [], "method", false, false, false, 19), "html", null, true);
            echo "
        </span>
        <span class=\"query\">
            ";
            // line 22
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getQuery", [], "method", false, false, false, 22), "html", null, true);
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
        return array (  72 => 22,  66 => 19,  61 => 18,  59 => 15,  58 => 7,  54 => 6,  49 => 5,  45 => 4,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "console/bookmark_content.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\console\\bookmark_content.twig");
    }
}
