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

/* export/alias_add.twig */
class __TwigTemplate_03276544fa09fb472e7ce66c9bcb18c4e31e7e392136385846f00f24bd956988 extends \Twig\Template
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
        echo "<table>
    <thead>
        <tr>
            <th colspan=\"4\">";
        // line 4
        echo _gettext("Define new aliases");
        echo "</th>
        </tr>
    </thead>
    <tr>
        <td>
            <label>";
        // line 9
        echo _gettext("Select database:");
        echo "</label>
        </td>
        <td>
            <select id=\"db_alias_select\"><option value=\"\"></option></select>
        </td>
        <td>
            <input id=\"db_alias_name\" placeholder=\"";
        // line 15
        echo _gettext("New database name");
        echo "\" disabled=\"1\">
        </td>
        <td>
            <button id=\"db_alias_button\" class=\"btn btn-secondary\" disabled=\"1\">";
        // line 18
        echo _gettext("Add");
        echo "</button>
        </td>
    </tr>
    <tr>
        <td>
            <label>";
        // line 23
        echo _gettext("Select table:");
        echo "</label>
        </td>
        <td>
            <select id=\"table_alias_select\"><option value=\"\"></option></select>
        </td>
        <td>
            <input id=\"table_alias_name\" placeholder=\"";
        // line 29
        echo _gettext("New table name");
        echo "\" disabled=\"1\">
        </td>
        <td>
            <button id=\"table_alias_button\" class=\"btn btn-secondary\" disabled=\"1\">";
        // line 32
        echo _gettext("Add");
        echo "</button>
        </td>
    </tr>
    <tr>
        <td>
            <label>";
        // line 37
        echo _gettext("Select column:");
        echo "</label>
        </td>
        <td>
            <select id=\"column_alias_select\"><option value=\"\"></option></select>
        </td>
        <td>
            <input id=\"column_alias_name\" placeholder=\"";
        // line 43
        echo _gettext("New column name");
        echo "\" disabled=\"1\">
        </td>
        <td>
            <button id=\"column_alias_button\" class=\"btn btn-secondary\" disabled=\"1\">";
        // line 46
        echo _gettext("Add");
        echo "</button>
        </td>
    </tr>
</table>
";
    }

    public function getTemplateName()
    {
        return "export/alias_add.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  111 => 46,  105 => 43,  96 => 37,  88 => 32,  82 => 29,  73 => 23,  65 => 18,  59 => 15,  50 => 9,  42 => 4,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "export/alias_add.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\export\\alias_add.twig");
    }
}
