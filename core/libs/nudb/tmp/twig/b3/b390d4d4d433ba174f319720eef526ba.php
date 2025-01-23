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

/* database/structure/bulk_action_modal.twig */
class __TwigTemplate_ac38d24ab9f4c000dae5e1d91b1237e0 extends Template
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
        yield "<div class=\"modal fade\" id=\"bulkActionModal\" data-bs-backdrop=\"static\" data-bs-keyboard=\"false\"
     tabindex=\"-1\" aria-labelledby=\"bulkActionLabel\" aria-hidden=\"true\">
  <div class=\"modal-dialog modal-dialog-centered\">
    <div class=\"modal-content\">
      <div class=\"modal-header\">
        <h5 class=\"modal-title\" id=\"bulkActionLabel\"></h5>
        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
yield _gettext("Cancel");
        // line 7
        yield "\"></button>
      </div>
      <div class=\"modal-body\"></div>
      <div class=\"modal-footer\">
        <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">";
yield _gettext("Cancel");
        // line 11
        yield "</button>
        <button type=\"button\" class=\"btn btn-primary\" id=\"bulkActionContinue\">";
yield _gettext("Continue");
        // line 12
        yield "</button>
      </div>
    </div>
  </div>
</div>";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/structure/bulk_action_modal.twig";
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
        return array (  58 => 12,  54 => 11,  47 => 7,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/bulk_action_modal.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\structure\\bulk_action_modal.twig");
    }
}
