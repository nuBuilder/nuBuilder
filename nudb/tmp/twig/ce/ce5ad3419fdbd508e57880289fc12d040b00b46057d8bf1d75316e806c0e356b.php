<?php

/* database/structure/favorite_anchor.twig */
class __TwigTemplate_859d6a9983bfe2a4d196ea19e8deea3f0302a6d8bdf533602971df75d67d4d8e extends Twig_Template
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
        echo "<a id=\"";
        echo twig_escape_filter($this->env, ($context["table_name_hash"] ?? null), "html", null, true);
        echo "_favorite_anchor\"
    class=\"ajax favorite_table_anchor\"
    href=\"db_structure.php";
        // line 3
        echo PhpMyAdmin\Url::getCommon(($context["fav_params"] ?? null));
        echo "\"
    title=\"";
        // line 4
        echo twig_escape_filter($this->env, ((($context["already_favorite"] ?? null)) ? (_gettext("Remove from Favorites")) : (_gettext("Add to Favorites"))), "html", null, true);
        echo "\"
    data-favtargets=\"";
        // line 5
        echo twig_escape_filter($this->env, ($context["db_table_name_hash"] ?? null), "html", null, true);
        echo "\" >
    ";
        // line 6
        echo ((($context["already_favorite"] ?? null)) ? ($this->getAttribute(($context["titles"] ?? null), "Favorite", array(), "array")) : ($this->getAttribute(($context["titles"] ?? null), "NoFavorite", array(), "array")));
        echo "
</a>
";
    }

    public function getTemplateName()
    {
        return "database/structure/favorite_anchor.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  37 => 6,  33 => 5,  29 => 4,  25 => 3,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "database/structure/favorite_anchor.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\favorite_anchor.twig");
    }
}
