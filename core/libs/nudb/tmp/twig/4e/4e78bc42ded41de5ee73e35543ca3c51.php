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

/* database/create_table.twig */
class __TwigTemplate_2e966d2a77db1a1d755c6e09e8866dd4 extends Template
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
        yield "<form id=\"createTableMinimalForm\" method=\"post\" action=\"";
        yield PhpMyAdmin\Url::getFromRoute("/table/create");
        yield "\" class=\"card d-print-none lock-page\">
  ";
        // line 2
        yield PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null));
        yield "
  <div class=\"card-header\">";
        // line 3
        yield PhpMyAdmin\Html\Generator::getIcon("b_table_add", _gettext("Create new table"), true);
        yield "</div>
  <div class=\"card-body row row-cols-lg-auto g-3\">
    <div class=\"col-12\">
      <label for=\"createTableNameInput\" class=\"form-label\">";
yield _gettext("Table name");
        // line 6
        yield "</label>
      <input autocomplete=\"off\" type=\"text\" class=\"form-control\" name=\"table\" id=\"createTableNameInput\" maxlength=\"64\" required>
    </div>
    <div class=\"col-12\">
      <label for=\"createTableNumFieldsInput\" class=\"form-label\">";
yield _gettext("Number of columns");
        // line 10
        yield "</label>
      <input type=\"number\" class=\"form-control\" name=\"num_fields\" id=\"createTableNumFieldsInput\" min=\"1\" value=\"4\" required>
    </div>
    <div class=\"col-12 align-self-lg-end\">
      <input class=\"btn btn-primary\" type=\"submit\" value=\"";
yield _gettext("Create");
        // line 14
        yield "\">
    </div>
  </div>
</form>
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "database/create_table.twig";
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
        return array (  68 => 14,  61 => 10,  54 => 6,  47 => 3,  43 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/create_table.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\database\\create_table.twig");
    }
}
