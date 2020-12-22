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

/* display/results/table_navigation.twig */
class __TwigTemplate_b2d6772b9d0c5a9d97281610f1a8447296cf0ca34516ced4c7e71f81baee2956 extends \Twig\Template
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
        echo "<table class=\"navigation nospacing nopadding print_ignore\">
  <tr>
    <td class=\"navigation_separator\"></td>
    ";
        // line 4
        echo ($context["move_backward_buttons"] ?? null);
        echo "
    ";
        // line 5
        echo ($context["page_selector"] ?? null);
        echo "
    ";
        // line 6
        echo ($context["move_forward_buttons"] ?? null);
        echo "
    ";
        // line 7
        if ((($context["number_total_page"] ?? null) > 1)) {
            // line 8
            echo "      <td><div class=\"navigation_separator\">|</div></td>
    ";
        }
        // line 10
        echo "    ";
        if (($context["has_show_all"] ?? null)) {
            // line 11
            echo "      <td>
        <form action=\"sql.php\" method=\"post\">
          ";
            // line 13
            echo PhpMyAdmin\Url::getHiddenFields(twig_array_merge(($context["hidden_fields"] ?? null), ["session_max_rows" =>             // line 14
($context["session_max_rows"] ?? null), "pos" => "0"]));
            // line 16
            echo "
          <input type=\"checkbox\" name=\"navig\" id=\"showAll_";
            // line 17
            echo twig_escape_filter($this->env, ($context["unique_id"] ?? null), "html", null, true);
            echo "\" class=\"showAllRows\" value=\"all\"";
            // line 18
            echo ((($context["is_showing_all"] ?? null)) ? (" checked") : (""));
            echo ">
          <label for=\"showAll_";
            // line 19
            echo twig_escape_filter($this->env, ($context["unique_id"] ?? null), "html", null, true);
            echo "\">";
            echo _gettext("Show all");
            echo "</label>
        </form>
      </td>
      <td><div class=\"navigation_separator\">|</div></td>
    ";
        }
        // line 24
        echo "    <td>
      <div class=\"save_edited hide\">
        <input class=\"btn btn-link\" type=\"submit\" value=\"";
        // line 26
        echo _gettext("Save edited data");
        echo "\">
        <div class=\"navigation_separator\">|</div>
      </div>
    </td>
    <td>
      <div class=\"restore_column hide\">
        <input class=\"btn btn-link\" type=\"submit\" value=\"";
        // line 32
        echo _gettext("Restore column order");
        echo "\">
        <div class=\"navigation_separator\">|</div>
      </div>
    </td>
    <td class=\"navigation_goto\">
      ";
        // line 38
        echo "      ";
        // line 39
        echo "      ";
        // line 40
        echo "      ";
        // line 41
        echo "      <form action=\"sql.php\" method=\"post\" onsubmit=\"return (Functions.checkFormElementInRange(this, 'session_max_rows', '";
        // line 42
        echo twig_escape_filter($this->env, twig_replace_filter(_gettext("%d is not valid row number."), ["'" => "\\'"]), "html", null, true);
        // line 43
        echo "', 1) && Functions.checkFormElementInRange(this, 'pos', '";
        // line 44
        echo twig_escape_filter($this->env, twig_replace_filter(_gettext("%d is not valid row number."), ["'" => "\\'"]), "html", null, true);
        // line 45
        echo "', 0";
        // line 46
        (((($context["unlim_num_rows"] ?? null) > 0)) ? (print (twig_escape_filter($this->env, (", " . (($context["unlim_num_rows"] ?? null) - 1)), "html", null, true))) : (print ("")));
        // line 47
        echo "));\">

        ";
        // line 49
        echo PhpMyAdmin\Url::getHiddenFields(twig_array_merge(($context["hidden_fields"] ?? null), ["pos" =>         // line 50
($context["pos"] ?? null)]));
        // line 51
        echo "

        ";
        // line 53
        echo _gettext("Number of rows:");
        // line 54
        echo "
        ";
        // line 55
        echo PhpMyAdmin\Util::getDropdown("session_max_rows", ["25" => 25, "50" => 50, "100" => 100, "250" => 250, "500" => 500],         // line 64
($context["max_rows"] ?? null), "", "autosubmit", ((        // line 67
($context["is_showing_all"] ?? null)) ? (_gettext("All")) : ("")));
        // line 68
        echo "
      </form>
    </td>
    <td class=\"navigation_separator\"></td>
    <td class=\"largescreenonly\">
      <span>";
        // line 73
        echo _gettext("Filter rows");
        echo ":</span>
      <input type=\"text\" class=\"filter_rows\" placeholder=\"";
        // line 75
        echo _gettext("Search this table");
        echo "\" data-for=\"";
        echo twig_escape_filter($this->env, ($context["unique_id"] ?? null), "html", null, true);
        echo "\">
    </td>
    <td class=\"largescreenonly\">
      ";
        // line 78
        echo ($context["sort_by_key"] ?? null);
        echo "
    </td>
    <td class=\"navigation_separator\"></td>
  </tr>
</table>
";
    }

    public function getTemplateName()
    {
        return "display/results/table_navigation.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  168 => 78,  160 => 75,  156 => 73,  149 => 68,  147 => 67,  146 => 64,  145 => 55,  142 => 54,  140 => 53,  136 => 51,  134 => 50,  133 => 49,  129 => 47,  127 => 46,  125 => 45,  123 => 44,  121 => 43,  119 => 42,  117 => 41,  115 => 40,  113 => 39,  111 => 38,  103 => 32,  94 => 26,  90 => 24,  80 => 19,  76 => 18,  73 => 17,  70 => 16,  68 => 14,  67 => 13,  63 => 11,  60 => 10,  56 => 8,  54 => 7,  50 => 6,  46 => 5,  42 => 4,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/results/table_navigation.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\results\\table_navigation.twig");
    }
}
