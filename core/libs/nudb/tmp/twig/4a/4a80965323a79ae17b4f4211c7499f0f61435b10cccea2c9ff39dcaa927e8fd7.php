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

/* table/search/rows_normal.twig */
class __TwigTemplate_084f0334e971444110f34058f0aeaf7bc4f31a92ce0ee0df52acfc117311b6e6 extends \Twig\Template
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
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(range(0, (twig_length_filter($this->env, ($context["column_names"] ?? null)) - 1)));
        foreach ($context['_seq'] as $context["_key"] => $context["column_index"]) {
            // line 2
            echo "    <tr class=\"noclick\">
        ";
            // line 4
            echo "        ";
            if (($context["geom_column_flag"] ?? null)) {
                // line 5
                echo "            ";
                $this->loadTemplate("table/search/geom_func.twig", "table/search/rows_normal.twig", 5)->display(twig_to_array(["column_index" =>                 // line 6
$context["column_index"], "column_types" =>                 // line 7
($context["column_types"] ?? null)]));
                // line 9
                echo "        ";
            }
            // line 10
            echo "        ";
            // line 11
            echo "        <th>
            ";
            // line 12
            echo twig_escape_filter($this->env, (($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = ($context["column_names"] ?? null)) && is_array($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) || $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 instanceof ArrayAccess ? ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4[$context["column_index"]] ?? null) : null), "html", null, true);
            echo "
        </th>
        ";
            // line 14
            $context["properties"] = twig_get_attribute($this->env, $this->source, ($context["self"] ?? null), "getColumnProperties", [0 => $context["column_index"], 1 => $context["column_index"]], "method", false, false, false, 14);
            // line 15
            echo "        <td dir=\"ltr\">
            ";
            // line 16
            echo twig_escape_filter($this->env, (($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = ($context["properties"] ?? null)) && is_array($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144) || $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 instanceof ArrayAccess ? ($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144["type"] ?? null) : null), "html", null, true);
            echo "
        </td>
        <td>
            ";
            // line 19
            echo twig_escape_filter($this->env, (($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = ($context["properties"] ?? null)) && is_array($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b) || $__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b instanceof ArrayAccess ? ($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b["collation"] ?? null) : null), "html", null, true);
            echo "
        </td>
        <td>
            ";
            // line 22
            echo (($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = ($context["properties"] ?? null)) && is_array($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002) || $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 instanceof ArrayAccess ? ($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002["func"] ?? null) : null);
            echo "
        </td>
        ";
            // line 25
            echo "        <td data-type=\"";
            echo twig_escape_filter($this->env, (($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 = ($context["properties"] ?? null)) && is_array($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4) || $__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4 instanceof ArrayAccess ? ($__internal_d7fc55f1a54b629533d60b43063289db62e68921ee7a5f8de562bd9d4a2b7ad4["type"] ?? null) : null), "html", null, true);
            echo "\">
            ";
            // line 26
            echo (($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 = ($context["properties"] ?? null)) && is_array($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666) || $__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666 instanceof ArrayAccess ? ($__internal_01476f8db28655ee4ee02ea2d17dd5a92599be76304f08cd8bc0e05aced30666["value"] ?? null) : null);
            echo "
            ";
            // line 28
            echo "            <input type=\"hidden\"
                name=\"criteriaColumnNames[";
            // line 29
            echo twig_escape_filter($this->env, $context["column_index"], "html", null, true);
            echo "]\"
                value=\"";
            // line 30
            echo twig_escape_filter($this->env, (($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e = ($context["column_names"] ?? null)) && is_array($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e) || $__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e instanceof ArrayAccess ? ($__internal_01c35b74bd85735098add188b3f8372ba465b232ab8298cb582c60f493d3c22e[$context["column_index"]] ?? null) : null), "html", null, true);
            echo "\">
            <input type=\"hidden\"
                name=\"criteriaColumnTypes[";
            // line 32
            echo twig_escape_filter($this->env, $context["column_index"], "html", null, true);
            echo "]\"
                value=\"";
            // line 33
            echo twig_escape_filter($this->env, (($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 = ($context["column_types"] ?? null)) && is_array($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52) || $__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52 instanceof ArrayAccess ? ($__internal_63ad1f9a2bf4db4af64b010785e9665558fdcac0e8db8b5b413ed986c62dbb52[$context["column_index"]] ?? null) : null), "html", null, true);
            echo "\">
            <input type=\"hidden\"
                name=\"criteriaColumnCollations[";
            // line 35
            echo twig_escape_filter($this->env, $context["column_index"], "html", null, true);
            echo "]\"
                value=\"";
            // line 36
            echo twig_escape_filter($this->env, (($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 = ($context["column_collations"] ?? null)) && is_array($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136) || $__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136 instanceof ArrayAccess ? ($__internal_f10a4cc339617934220127f034125576ed229e948660ebac906a15846d52f136[$context["column_index"]] ?? null) : null), "html", null, true);
            echo "\">
        </td>
    </tr>
";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['column_index'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
    }

    public function getTemplateName()
    {
        return "table/search/rows_normal.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  121 => 36,  117 => 35,  112 => 33,  108 => 32,  103 => 30,  99 => 29,  96 => 28,  92 => 26,  87 => 25,  82 => 22,  76 => 19,  70 => 16,  67 => 15,  65 => 14,  60 => 12,  57 => 11,  55 => 10,  52 => 9,  50 => 7,  49 => 6,  47 => 5,  44 => 4,  41 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "table/search/rows_normal.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\search\\rows_normal.twig");
    }
}
