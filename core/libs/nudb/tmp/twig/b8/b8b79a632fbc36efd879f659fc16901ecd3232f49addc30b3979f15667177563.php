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

/* export/alias_item.twig */
class __TwigTemplate_31bf9756d8e2590992644ff34fc823e2a2c4734a04f3be985325f4a5dbd22f40 extends \Twig\Template
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
        echo "<tr>
    <th>";
        // line 2
        echo twig_escape_filter($this->env, ($context["type"] ?? null), "html", null, true);
        echo "</th>
    <td>";
        // line 3
        echo twig_escape_filter($this->env, ($context["name"] ?? null), "html", null, true);
        echo "</td>
    <td>
        <input name=\"";
        // line 5
        echo twig_escape_filter($this->env, ($context["field"] ?? null), "html", null, true);
        echo "\" value=\"";
        echo twig_escape_filter($this->env, ($context["value"] ?? null), "html", null, true);
        echo "\" type=\"text\">
    </td>
    <td>
        <button class=\"alias_remove btn btn-secondary\">";
        // line 8
        echo _gettext("Remove");
        echo "</button>
    </td>
</tr>
";
    }

    public function getTemplateName()
    {
        return "export/alias_item.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  57 => 8,  49 => 5,  44 => 3,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "export/alias_item.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\export\\alias_item.twig");
    }
}
