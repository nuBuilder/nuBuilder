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

/* display/export/options_rows.twig */
class __TwigTemplate_8961e81aa47d0721ca5ed342028b0473fcb26ec68195e9ad5639ff3670bd8c0c extends \Twig\Template
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
        echo "<div class=\"exportoptions\" id=\"rows\">
    <h3>";
        // line 2
        echo _gettext("Rows:");
        echo "</h3>
    <ul>
        <li>
            <input type=\"radio\" name=\"allrows\" value=\"0\" id=\"radio_allrows_0\"";
        // line 6
        echo ((( !(null === ($context["allrows"] ?? null)) && (($context["allrows"] ?? null) == 0))) ? (" checked") : (""));
        echo ">
            <label for=\"radio_allrows_0\">";
        // line 7
        echo _gettext("Dump some row(s)");
        echo "</label>
            <ul>
                <li>
                    <label for=\"limit_to\">";
        // line 10
        echo _gettext("Number of rows:");
        echo "</label>
                    <input type=\"text\" id=\"limit_to\" name=\"limit_to\" size=\"5\" value=\"";
        // line 12
        ob_start(function () { return ''; });
        // line 13
        echo "                            ";
        if ( !(null === ($context["limit_to"] ?? null))) {
            // line 14
            echo "                                ";
            echo twig_escape_filter($this->env, ($context["limit_to"] ?? null), "html", null, true);
            echo "
                            ";
        } elseif (( !twig_test_empty(        // line 15
($context["unlim_num_rows"] ?? null)) && (($context["unlim_num_rows"] ?? null) != 0))) {
            // line 16
            echo "                                ";
            echo twig_escape_filter($this->env, ($context["unlim_num_rows"] ?? null), "html", null, true);
            echo "
                            ";
        } else {
            // line 18
            echo "                                ";
            echo twig_escape_filter($this->env, ($context["number_of_rows"] ?? null), "html", null, true);
            echo "
                            ";
        }
        // line 20
        echo "                        ";
        $___internal_0bb578c3381ce64cc03aa2ad6f8a7cf46d6b3eb49e3f904c704dc0710715809f_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 12
        echo twig_spaceless($___internal_0bb578c3381ce64cc03aa2ad6f8a7cf46d6b3eb49e3f904c704dc0710715809f_);
        // line 20
        echo "\" onfocus=\"this.select()\">
                </li>
                <li>
                    <label for=\"limit_from\">";
        // line 23
        echo _gettext("Row to begin at:");
        echo "</label>
                    <input type=\"text\" id=\"limit_from\" name=\"limit_from\" size=\"5\" value=\"";
        // line 25
        (( !(null === ($context["limit_from"] ?? null))) ? (print (twig_escape_filter($this->env, ($context["limit_from"] ?? null), "html", null, true))) : (print (0)));
        echo "\" onfocus=\"this.select()\">
                </li>
            </ul>
        </li>
        <li>
            <input type=\"radio\" name=\"allrows\" value=\"1\" id=\"radio_allrows_1\"";
        // line 31
        echo ((((null === ($context["allrows"] ?? null)) || (($context["allrows"] ?? null) == 1))) ? (" checked") : (""));
        echo ">
             <label for=\"radio_allrows_1\">";
        // line 32
        echo _gettext("Dump all rows");
        echo "</label>
        </li>
    </ul>
</div>
";
    }

    public function getTemplateName()
    {
        return "display/export/options_rows.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  110 => 32,  106 => 31,  98 => 25,  94 => 23,  89 => 20,  87 => 12,  84 => 20,  78 => 18,  72 => 16,  70 => 15,  65 => 14,  62 => 13,  60 => 12,  56 => 10,  50 => 7,  46 => 6,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/export/options_rows.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\export\\options_rows.twig");
    }
}
