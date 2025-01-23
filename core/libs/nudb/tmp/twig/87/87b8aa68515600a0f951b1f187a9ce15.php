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

/* database/structure/favorite_anchor.twig */
class __TwigTemplate_c4fc5f6c516ae2a010293b25c1e8e335 extends Template
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
        yield "<a id=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["table_name_hash"] ?? null), "html", null, true);
        yield "_favorite_anchor\"
    class=\"ajax favorite_table_anchor\"
    href=\"";
        // line 3
        yield PhpMyAdmin\Url::getFromRoute("/database/structure/favorite-table", ($context["fav_params"] ?? null));
        yield "\"
    title=\"";
        // line 4
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(((($context["already_favorite"] ?? null)) ? (_gettext("Remove from Favorites")) : (_gettext("Add to Favorites"))), "html", null, true);
        yield "\"
    data-favtargets=\"";
        // line 5
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["db_table_name_hash"] ?? null), "html", null, true);
        yield "\">
    ";
        // line 6
        yield ((($context["already_favorite"] ?? null)) ? (PhpMyAdmin\Html\Generator::getIcon("b_favorite")) : (PhpMyAdmin\Html\Generator::getIcon("b_no_favorite")));
        yield "
</a>
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/structure/favorite_anchor.twig";
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
        return array (  56 => 6,  52 => 5,  48 => 4,  44 => 3,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/favorite_anchor.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\structure\\favorite_anchor.twig");
    }
}
