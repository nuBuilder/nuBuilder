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

/* database/structure/index.twig */
class __TwigTemplate_9077e10bbb659894857d0e3b4a816580a665d6d42cbdb72ecfddbf9aa26289a1 extends \Twig\Template
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
        if (($context["has_tables"] ?? null)) {
            // line 2
            echo "  <div id=\"tableslistcontainer\">
    ";
            // line 3
            echo ($context["list_navigator_html"] ?? null);
            echo "

    ";
            // line 5
            echo ($context["table_list_html"] ?? null);
            echo "

    ";
            // line 7
            echo ($context["list_navigator_html"] ?? null);
            echo "
  </div>
  <hr>
  <p class=\"print_ignore\">
    <a href=\"#\" id=\"printView\">
      ";
            // line 12
            echo PhpMyAdmin\Util::getIcon("b_print", _gettext("Print"), true);
            echo "
    </a>
    <a href=\"db_datadict.php";
            // line 14
            echo PhpMyAdmin\Url::getCommon(["db" => ($context["database"] ?? null), "goto" => "db_structure.php"]);
            echo "\" target=\"print_view\">
      ";
            // line 15
            echo PhpMyAdmin\Util::getIcon("b_tblanalyse", _gettext("Data dictionary"), true);
            echo "
    </a>
  </p>
";
        } else {
            // line 19
            echo "  ";
            echo call_user_func_array($this->env->getFilter('notice')->getCallable(), [_gettext("No tables found in database.")]);
            echo "
";
        }
        // line 21
        echo "
";
        // line 22
        if ( !($context["is_system_schema"] ?? null)) {
            // line 23
            echo "  ";
            echo ($context["create_table_html"] ?? null);
            echo "
";
        }
    }

    public function getTemplateName()
    {
        return "database/structure/index.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  87 => 23,  85 => 22,  82 => 21,  76 => 19,  69 => 15,  65 => 14,  60 => 12,  52 => 7,  47 => 5,  42 => 3,  39 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/index.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\database\\structure\\index.twig");
    }
}
