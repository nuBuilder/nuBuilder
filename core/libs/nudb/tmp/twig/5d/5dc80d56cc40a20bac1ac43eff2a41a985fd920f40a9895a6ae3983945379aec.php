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

/* database/export/index.twig */
class __TwigTemplate_ab66159e699e783b3e5e22902c5e7281d7ac10df7170f94e725105dfee62c26b extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'selection_options' => [$this, 'block_selection_options'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "export.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 61
        ob_start(function () { return ''; });
        // line 62
        echo "  ";
        echo _gettext("@SERVER@ will become the server name and @DATABASE@ will become the database name.");
        $context["filename_hint"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 1
        $this->parent = $this->loadTemplate("export.twig", "database/export/index.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "  ";
        if ((($context["export_type"] ?? null) == "raw")) {
            // line 5
            echo "    ";
            // l10n: A query that the user has written freely
            echo _gettext("Exporting a raw query");
            // line 6
            echo "  ";
        } else {
            // line 7
            echo "    ";
            echo twig_escape_filter($this->env, sprintf(_gettext("Exporting tables from \"%s\" database"), ($context["db"] ?? null)), "html", null, true);
            echo "
  ";
        }
    }

    // line 11
    public function block_selection_options($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 12
        echo "  ";
        if ((($context["export_type"] ?? null) != "raw")) {
            // line 13
            echo "    <div class=\"exportoptions\" id=\"databases_and_tables\">
      <h3>";
            // line 14
            echo _gettext("Tables:");
            echo "</h3>

      <div class=\"export_table_list_container\">
        <input type=\"hidden\" name=\"structure_or_data_forced\" value=\"";
            // line 17
            echo twig_escape_filter($this->env, ($context["structure_or_data_forced"] ?? null), "html", null, true);
            echo "\">

        <table class=\"pma-table export_table_select\">
          <thead>
            <tr>
              <th></th>
              <th>";
            // line 23
            echo _gettext("Tables");
            echo "</th>
              <th class=\"export_structure\">";
            // line 24
            echo _gettext("Structure");
            echo "</th>
              <th class=\"export_data\">";
            // line 25
            echo _gettext("Data");
            echo "</th>
            </tr>
            <tr>
              <td></td>
              <td class=\"export_table_name all\">";
            // line 29
            echo _gettext("Select all");
            echo "</td>
              <td class=\"export_structure all\">
                <input type=\"checkbox\" id=\"table_structure_all\">
              </td>
              <td class=\"export_data all\">
                <input type=\"checkbox\" id=\"table_data_all\">
              </td>
            </tr>
          </thead>

          <tbody>
            ";
            // line 40
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["tables"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["each_table"]) {
                // line 41
                echo "              <tr class=\"marked\">
                <td>
                  <input class=\"checkall\" type=\"checkbox\" name=\"table_select[]\" value=\"";
                // line 43
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 43), "html", null, true);
                echo "\"";
                echo ((twig_get_attribute($this->env, $this->source, $context["each_table"], "is_checked_select", [], "any", false, false, false, 43)) ? (" checked") : (""));
                echo ">
                </td>
                <td class=\"export_table_name text-nowrap\">";
                // line 45
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 45), "html", null, true);
                echo "</td>
                <td class=\"export_structure\">
                  <input type=\"checkbox\" name=\"table_structure[]\" value=\"";
                // line 47
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 47), "html", null, true);
                echo "\"";
                echo ((twig_get_attribute($this->env, $this->source, $context["each_table"], "is_checked_structure", [], "any", false, false, false, 47)) ? (" checked") : (""));
                echo ">
                </td>
                <td class=\"export_data\">
                  <input type=\"checkbox\" name=\"table_data[]\" value=\"";
                // line 50
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["each_table"], "name", [], "any", false, false, false, 50), "html", null, true);
                echo "\"";
                echo ((twig_get_attribute($this->env, $this->source, $context["each_table"], "is_checked_data", [], "any", false, false, false, 50)) ? (" checked") : (""));
                echo ">
                </td>
              </tr>
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['each_table'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 54
            echo "          </tbody>
        </table>
      </div>
    </div>
  ";
        }
    }

    public function getTemplateName()
    {
        return "database/export/index.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  170 => 54,  158 => 50,  150 => 47,  145 => 45,  138 => 43,  134 => 41,  130 => 40,  116 => 29,  109 => 25,  105 => 24,  101 => 23,  92 => 17,  86 => 14,  83 => 13,  80 => 12,  76 => 11,  68 => 7,  65 => 6,  61 => 5,  58 => 4,  54 => 3,  49 => 1,  45 => 62,  43 => 61,  36 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/export/index.twig", "C:\\xampp\\htdocs\\nubuilder4\\core\\libs\\nudb\\templates\\database\\export\\index.twig");
    }
}
