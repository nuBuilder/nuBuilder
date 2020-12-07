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

/* table/page_with_secondary_tabs.twig */
class __TwigTemplate_a06211e29d6d22ed57cc8f346af52d9f5b4b12774b1356cf4eee2461e62f584a extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
            'content' => [$this, 'block_content'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        if (((($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["cfg_relation"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4["relwork"] ?? null) : null) || ($context["is_foreign_key_supported"] ?? null))) {
            // line 2
            echo "    <ul id=\"topmenu2\">
        ";
            // line 3
            echo PhpMyAdmin\Util::getHtmlTab(["icon" => "b_props", "link" => "tbl_structure.php", "text" => _gettext("Table structure"), "id" => "table_strucuture_id"],             // line 8
($context["url_params"] ?? null));
            echo "
        ";
            // line 9
            echo PhpMyAdmin\Util::getHtmlTab(["icon" => "b_relations", "link" => "tbl_relation.php", "text" => _gettext("Relation view"), "id" => "table_relation_id"],             // line 14
($context["url_params"] ?? null));
            echo "
    </ul>
    <div class=\"clearfloat\"></div>
";
        }
        // line 18
        echo "
<div id=\"structure_content\">
    ";
        // line 20
        $this->displayBlock('content', $context, $blocks);
        // line 22
        echo "</div>
";
    }

    // line 20
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 21
        echo "    ";
    }

    public function getTemplateName()
    {
        return "table/page_with_secondary_tabs.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  71 => 21,  67 => 20,  62 => 22,  60 => 20,  56 => 18,  49 => 14,  48 => 9,  44 => 8,  43 => 3,  40 => 2,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/page_with_secondary_tabs.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\page_with_secondary_tabs.twig");
    }
}
