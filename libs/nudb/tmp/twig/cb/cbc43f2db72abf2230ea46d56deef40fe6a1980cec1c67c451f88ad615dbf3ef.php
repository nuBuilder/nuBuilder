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

/* display/results/table_headers.twig */
class __TwigTemplate_0c9737d5a5adc09bd202059d99e91ef0299486e7f7011c9c700f7caa58f7480c extends \Twig\Template
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
        echo "<input class=\"save_cells_at_once\" type=\"hidden\" value=\"";
        echo twig_escape_filter($this->env, ($context["save_cells_at_once"] ?? null), "html", null, true);
        echo "\">
<div class=\"common_hidden_inputs\">
  ";
        // line 3
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
        echo "
</div>

";
        // line 6
        echo ($context["data_for_resetting_column_order"] ?? null);
        echo "
";
        // line 7
        echo ($context["options_block"] ?? null);
        echo "

";
        // line 9
        if (((($context["delete_link"] ?? null) == ($context["delete_row"] ?? null)) || (($context["delete_link"] ?? null) == ($context["kill_process"] ?? null)))) {
            // line 10
            echo "  <form method=\"post\" action=\"tbl_row_action.php\" name=\"resultsForm\" id=\"resultsForm_";
            echo twig_escape_filter($this->env, ($context["unique_id"] ?? null), "html", null, true);
            echo "\" class=\"ajax\">
    ";
            // line 11
            echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null), 1);
            echo "
    <input type=\"hidden\" name=\"goto\" value=\"sql.php\">
";
        }
        // line 14
        echo "
<div class=\"responsivetable\">
  <table class=\"table_results data ajax\" data-uniqueId=\"";
        // line 16
        echo twig_escape_filter($this->env, ($context["unique_id"] ?? null), "html", null, true);
        echo "\">

    ";
        // line 18
        echo ($context["button"] ?? null);
        echo "
    ";
        // line 19
        echo ($context["table_headers_for_columns"] ?? null);
        echo "
    ";
        // line 20
        echo ($context["column_at_right_side"] ?? null);
        echo "

      </tr>
    </thead>
";
    }

    public function getTemplateName()
    {
        return "display/results/table_headers.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  88 => 20,  84 => 19,  80 => 18,  75 => 16,  71 => 14,  65 => 11,  60 => 10,  58 => 9,  53 => 7,  49 => 6,  43 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "display/results/table_headers.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\results\\table_headers.twig");
    }
}
