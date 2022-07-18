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
class __TwigTemplate_7f8afcaba0079f646d4d51c1aa52a021 extends Template
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
            echo "  <div class=\"message collapsed bookmark\" bookmarkid=\"";
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getId", [], "method", false, false, false, 5), "html", null, true);
            echo "\" targetdb=\"";
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getDatabase", [], "method", false, false, false, 5), "html", null, true);
            echo "\">
    <div class=\"action_content\">
      <span class=\"action collapse\">";
            // line 7
            echo twig_escape_filter($this->env, _gettext("Collapse"), "html", null, true);
            echo "</span>
      <span class=\"action expand\">";
            // line 8
            echo twig_escape_filter($this->env, _gettext("Expand"), "html", null, true);
            echo "</span>
      <span class=\"action requery\">";
            // line 9
            echo twig_escape_filter($this->env, _gettext("Requery"), "html", null, true);
            echo "</span>
      <span class=\"action edit_bookmark\">";
            // line 10
            echo twig_escape_filter($this->env, _gettext("Edit"), "html", null, true);
            echo "</span>
      <span class=\"action delete_bookmark\">";
            // line 11
            echo twig_escape_filter($this->env, _gettext("Delete"), "html", null, true);
            echo "</span>
      <span class=\"text targetdb\">";
            // line 12
            echo twig_escape_filter($this->env, _gettext("Database"), "html", null, true);
            echo ": <span>";
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getDatabase", [], "method", false, false, false, 12), "html", null, true);
            echo "</span></span>
    </div>

    <span class=\"bookmark_label";
            // line 15
            echo ((twig_test_empty(twig_get_attribute($this->env, $this->source, $context["bookmark"], "getUser", [], "method", false, false, false, 15))) ? (" shared") : (""));
            echo "\">";
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getLabel", [], "method", false, false, false, 15), "html", null, true);
            echo "</span>
    <span class=\"query\">";
            // line 16
            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["bookmark"], "getQuery", [], "method", false, false, false, 16), "html", null, true);
            echo "</span>
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
        return array (  91 => 16,  85 => 15,  77 => 12,  73 => 11,  69 => 10,  65 => 9,  61 => 8,  57 => 7,  49 => 5,  45 => 4,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "console/bookmark_content.twig", "C:\\xampp\\htdocs\\nubuilder4\\core\\libs\\nudb\\templates\\console\\bookmark_content.twig");
    }
}
