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

/* display/export/options_output_compression.twig */
class __TwigTemplate_8dab572b944038156e090e8e0e8aa292133be954d2a785f101d5b22ba71bbdd1 extends \Twig\Template
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
        if ((($context["is_zip"] ?? null) || ($context["is_gzip"] ?? null))) {
            // line 2
            echo "    <li>
        <label for=\"compression\" class=\"desc\">
            ";
            // line 4
            echo _gettext("Compression:");
            // line 5
            echo "        </label>
        <select id=\"compression\" name=\"compression\">
            <option value=\"none\">";
            // line 7
            echo _gettext("None");
            echo "</option>
            ";
            // line 8
            if (($context["is_zip"] ?? null)) {
                // line 9
                echo "                <option value=\"zip\"";
                // line 10
                echo (((($context["selected_compression"] ?? null) == "zip")) ? (" selected") : (""));
                echo ">
                    ";
                // line 11
                echo _gettext("zipped");
                // line 12
                echo "                </option>
            ";
            }
            // line 14
            echo "            ";
            if (($context["is_gzip"] ?? null)) {
                // line 15
                echo "                <option value=\"gzip\"";
                // line 16
                echo (((($context["selected_compression"] ?? null) == "gzip")) ? (" selected") : (""));
                echo ">
                    ";
                // line 17
                echo _gettext("gzipped");
                // line 18
                echo "                </option>
            ";
            }
            // line 20
            echo "        </select>
    </li>
";
        } else {
            // line 23
            echo "    <input type=\"hidden\" name=\"compression\" value=\"";
            echo twig_escape_filter($this->env, ($context["selected_compression"] ?? null), "html", null, true);
            echo "\">
";
        }
    }

    public function getTemplateName()
    {
        return "display/export/options_output_compression.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  87 => 23,  82 => 20,  78 => 18,  76 => 17,  72 => 16,  70 => 15,  67 => 14,  63 => 12,  61 => 11,  57 => 10,  55 => 9,  53 => 8,  49 => 7,  45 => 5,  43 => 4,  39 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/export/options_output_compression.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\export\\options_output_compression.twig");
    }
}
