<?php

/* table/structure/add_column.twig */
class __TwigTemplate_491db4a7fc12233218613e73d977c939d8db769ea8af57913c9638e2b54a8f12 extends Twig_Template
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
        echo "<form method=\"post\" action=\"tbl_addfield.php\" id=\"addColumns\" name=\"addColumns\">
    ";
        // line 2
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
        echo "
    ";
        // line 3
        if (PhpMyAdmin\Util::showIcons("ActionLinksMode")) {
            // line 4
            echo "        ";
            echo PhpMyAdmin\Util::getImage("b_insrow", _gettext("Add column"));
            echo "&nbsp;
    ";
        }
        // line 6
        echo "    ";
        $context["num_fields"] = ('' === $tmp = "<input type=\"number\" name=\"num_fields\" value=\"1\" onfocus=\"this.select()\" min=\"1\" required />") ? '' : new Twig_Markup($tmp, $this->env->getCharset());
        // line 9
        echo "    ";
        echo sprintf(_gettext("Add %s column(s)"), ($context["num_fields"] ?? null));
        echo "
    <input type=\"hidden\" name=\"field_where\" value=\"after\"/>&nbsp;
    ";
        // line 12
        echo "    <select name=\"after_field\">
        <option value=\"first\" data-pos=\"first\">
            ";
        // line 14
        echo _gettext("at beginning of table");
        // line 15
        echo "        </option>
        ";
        // line 16
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["columns_list"] ?? null));
        $context['loop'] = array(
          'parent' => $context['_parent'],
          'index0' => 0,
          'index'  => 1,
          'first'  => true,
        );
        if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof Countable)) {
            $length = count($context['_seq']);
            $context['loop']['revindex0'] = $length - 1;
            $context['loop']['revindex'] = $length;
            $context['loop']['length'] = $length;
            $context['loop']['last'] = 1 === $length;
        }
        foreach ($context['_seq'] as $context["_key"] => $context["one_column_name"]) {
            // line 17
            echo "            <option value=\"";
            echo twig_escape_filter($this->env, $context["one_column_name"], "html", null, true);
            echo "\"";
            // line 18
            echo ((($this->getAttribute($context["loop"], "revindex0", array()) == 0)) ? (" selected=\"selected\"") : (""));
            echo ">
                ";
            // line 19
            echo twig_escape_filter($this->env, sprintf(_gettext("after %s"), twig_escape_filter($this->env, $context["one_column_name"])), "html", null, true);
            echo "
            </option>
        ";
            ++$context['loop']['index0'];
            ++$context['loop']['index'];
            $context['loop']['first'] = false;
            if (isset($context['loop']['length'])) {
                --$context['loop']['revindex0'];
                --$context['loop']['revindex'];
                $context['loop']['last'] = 0 === $context['loop']['revindex0'];
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['one_column_name'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 22
        echo "    </select>
    <input type=\"submit\" value=\"";
        // line 23
        echo _gettext("Go");
        echo "\" />
</form>
";
    }

    public function getTemplateName()
    {
        return "table/structure/add_column.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  97 => 23,  94 => 22,  77 => 19,  73 => 18,  69 => 17,  52 => 16,  49 => 15,  47 => 14,  43 => 12,  37 => 9,  34 => 6,  28 => 4,  26 => 3,  22 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/add_column.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\add_column.twig");
    }
}
