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

/* modals/page_settings.twig */
class __TwigTemplate_f6ec16fe6c68af2c9ad8c7ff6f081d64 extends Template
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
        echo "<div class=\"modal fade\" id=\"pageSettingsModal\" tabindex=\"-1\" aria-labelledby=\"pageSettingsModalLabel\" aria-hidden=\"true\">
  <div class=\"modal-dialog modal-lg\" id=\"pageSettingsModalDialog\">
    <div class=\"modal-content\">
      <div class=\"modal-header\">
        <h5 class=\"modal-title\" id=\"pageSettingsModalLabel\">";
echo _gettext("Page-related settings");
        // line 5
        echo "</h5>
        <button type=\"button\" class=\"btn-close\" id=\"pageSettingsModalCloseButton\" aria-label=\"";
echo _gettext("Close");
        // line 6
        echo "\"></button>
      </div>
      <div class=\"modal-body\"></div>
      <div class=\"modal-footer\">
        <button type=\"button\" class=\"btn btn-secondary\" id=\"pageSettingsModalApplyButton\">";
echo _gettext("Apply");
        // line 10
        echo "</button>
        <button type=\"button\" class=\"btn btn-secondary\" id=\"pageSettingsModalCancelButton\">";
echo _gettext("Cancel");
        // line 11
        echo "</button>
      </div>
    </div>
  </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "modals/page_settings.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  59 => 11,  55 => 10,  48 => 6,  44 => 5,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "modals/page_settings.twig", "C:\\xampp\\htdocs\\nubuilder4\\core\\libs\\nudb\\templates\\modals\\page_settings.twig");
    }
}
