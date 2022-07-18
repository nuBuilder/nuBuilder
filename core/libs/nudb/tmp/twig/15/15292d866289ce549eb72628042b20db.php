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

/* footer.twig */
class __TwigTemplate_d771336993ee561108b0ca9c4db8c37a extends Template
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
        echo twig_include($this->env, $context, "modals/function_confirm.twig");
        echo "
";
        // line 2
        echo twig_include($this->env, $context, "modals/add_index.twig");
        echo "
";
        // line 3
        echo twig_include($this->env, $context, "modals/page_settings.twig");
        echo "
";
        // line 4
        if ( !($context["is_ajax"] ?? null)) {
            // line 5
            echo "  </div>
";
        }
        // line 7
        if (( !($context["is_ajax"] ?? null) &&  !($context["is_minimal"] ?? null))) {
            // line 8
            echo "  ";
            if ( !twig_test_empty(($context["self_url"] ?? null))) {
                // line 9
                echo "    <div id=\"selflink\" class=\"d-print-none\">
      <a href=\"";
                // line 10
                echo twig_escape_filter($this->env, ($context["self_url"] ?? null), "html", null, true);
                echo "\" title=\"";
echo _gettext("Open new phpMyAdmin window");
                echo "\" target=\"_blank\" rel=\"noopener noreferrer\">
        ";
                // line 11
                if (PhpMyAdmin\Util::showIcons("TabsMode")) {
                    // line 12
                    echo "          ";
                    echo PhpMyAdmin\Html\Generator::getImage("window-new", _gettext("Open new phpMyAdmin window"));
                    echo "
        ";
                } else {
                    // line 14
                    echo "          ";
echo _gettext("Open new phpMyAdmin window");
                    // line 15
                    echo "        ";
                }
                // line 16
                echo "      </a>
    </div>
  ";
            }
            // line 19
            echo "
  <div class=\"clearfloat d-print-none\" id=\"pma_errors\">
    ";
            // line 21
            echo ($context["error_messages"] ?? null);
            echo "
  </div>

  ";
            // line 24
            echo ($context["scripts"] ?? null);
            echo "

  ";
            // line 26
            if (($context["is_demo"] ?? null)) {
                // line 27
                echo "    <div id=\"pma_demo\" class=\"d-print-none\">
      ";
                // line 28
                ob_start(function () { return ''; });
                // line 29
                echo "        <a href=\"";
                echo PhpMyAdmin\Url::getFromRoute("/");
                echo "\">";
echo _gettext("phpMyAdmin Demo Server");
                echo ":</a>
        ";
                // line 30
                if ( !twig_test_empty(($context["git_revision_info"] ?? null))) {
                    // line 31
                    echo "          ";
                    ob_start(function () { return ''; });
                    // line 32
                    echo "<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"";
                    echo twig_escape_filter($this->env, PhpMyAdmin\Core::linkURL(twig_get_attribute($this->env, $this->source, ($context["git_revision_info"] ?? null), "revisionUrl", [], "any", false, false, false, 32)), "html", null, true);
                    echo "\">";
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["git_revision_info"] ?? null), "revision", [], "any", false, false, false, 32), "html", null, true);
                    echo "</a>";
                    $context["revision_info"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
                    // line 34
                    echo "          ";
                    ob_start(function () { return ''; });
                    // line 35
                    echo "<a target=\"_blank\" rel=\"noopener noreferrer\" href=\"";
                    echo twig_escape_filter($this->env, PhpMyAdmin\Core::linkURL(twig_get_attribute($this->env, $this->source, ($context["git_revision_info"] ?? null), "branchUrl", [], "any", false, false, false, 35)), "html", null, true);
                    echo "\">";
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["git_revision_info"] ?? null), "branch", [], "any", false, false, false, 35), "html", null, true);
                    echo "</a>";
                    $context["branch_info"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
                    // line 37
                    echo "          ";
                    echo twig_sprintf(_gettext("Currently running Git revision %1\$s from the %2\$s branch."), ($context["revision_info"] ?? null), ($context["branch_info"] ?? null));
                    echo "
        ";
                } else {
                    // line 39
                    echo "          ";
echo _gettext("Git information missing!");
                    // line 40
                    echo "        ";
                }
                // line 41
                echo "      ";
                $___internal_parse_0_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
                // line 28
                echo $this->env->getFilter('notice')->getCallable()($___internal_parse_0_);
                // line 42
                echo "    </div>
  ";
            }
            // line 44
            echo "
  ";
            // line 45
            echo ($context["footer"] ?? null);
            echo "
";
        }
        // line 47
        if ( !($context["is_ajax"] ?? null)) {
            // line 48
            echo "  </body>
</html>
";
        }
    }

    public function getTemplateName()
    {
        return "footer.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  170 => 48,  168 => 47,  163 => 45,  160 => 44,  156 => 42,  154 => 28,  151 => 41,  148 => 40,  145 => 39,  139 => 37,  132 => 35,  129 => 34,  122 => 32,  119 => 31,  117 => 30,  110 => 29,  108 => 28,  105 => 27,  103 => 26,  98 => 24,  92 => 21,  88 => 19,  83 => 16,  80 => 15,  77 => 14,  71 => 12,  69 => 11,  63 => 10,  60 => 9,  57 => 8,  55 => 7,  51 => 5,  49 => 4,  45 => 3,  41 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "footer.twig", "C:\\xampp\\htdocs\\nubuilder4\\core\\libs\\nudb\\templates\\footer.twig");
    }
}
