<?php

/* display/results/multi_row_operations_form.twig */
class __TwigTemplate_8221a06e8ccde380ad66f1cfea1d7447d6ff17f7c643a434aaeb65d9a70c21aa extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        if (((($context["delete_link"] ?? null) == ($context["delete_row"] ?? null)) || (($context["delete_link"] ?? null) == ($context["kill_process"] ?? null)))) {
            // line 2
            echo "    <form method=\"post\"
        action=\"tbl_row_action.php\"
        name=\"resultsForm\"
        id=\"resultsForm_";
            // line 5
            echo twig_escape_filter($this->env, ($context["unique_id"] ?? null), "html", null, true);
            echo "\"
        class=\"ajax\">
        ";
            // line 7
            echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null), 1);
            echo "
        <input type=\"hidden\" name=\"goto\" value=\"sql.php\" />
";
        }
        // line 10
        echo "
<div class=\"responsivetable\">
    <table class=\"table_results data ajax\" data-uniqueId=\"";
        // line 12
        echo twig_escape_filter($this->env, ($context["unique_id"] ?? null), "html", null, true);
        echo "\">
";
    }

    public function getTemplateName()
    {
        return "display/results/multi_row_operations_form.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  41 => 12,  37 => 10,  31 => 7,  26 => 5,  21 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "display/results/multi_row_operations_form.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\display\\results\\multi_row_operations_form.twig");
    }
}
