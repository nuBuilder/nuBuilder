<?php

/* table/structure/display_partitions.twig */
class __TwigTemplate_2b70d4dbd4e55b1cf43d105768e8d6f898229ad83ab0cd6caf225ae02862f2b2 extends Twig_Template
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
        echo "<div id=\"partitions\">
    <fieldset>
        <legend>
            ";
        // line 4
        echo _gettext("Partitions");
        // line 5
        echo "            ";
        echo PhpMyAdmin\Util::showMySQLDocu("partitioning");
        echo "
        </legend>
        ";
        // line 7
        if (twig_test_empty(($context["partitions"] ?? null))) {
            // line 8
            echo "            ";
            echo call_user_func_array($this->env->getFunction('Message_notice')->getCallable(), array(_gettext("No partitioning defined!")));
            echo "
        ";
        } else {
            // line 10
            echo "            <p>
                ";
            // line 11
            echo _gettext("Partitioned by:");
            // line 12
            echo "                <code>";
            echo twig_escape_filter($this->env, ($context["partition_method"] ?? null), "html", null, true);
            echo "(";
            echo twig_escape_filter($this->env, ($context["partition_expression"] ?? null), "html", null, true);
            echo ")</code>
            </p>
            ";
            // line 14
            if (($context["has_sub_partitions"] ?? null)) {
                // line 15
                echo "                <p>
                    ";
                // line 16
                echo _gettext("Sub partitioned by:");
                // line 17
                echo "                    <code>";
                echo twig_escape_filter($this->env, ($context["sub_partition_method"] ?? null), "html", null, true);
                echo "(";
                echo twig_escape_filter($this->env, ($context["sub_partition_expression"] ?? null), "html", null, true);
                echo ")</code>
                <p>
            ";
            }
            // line 20
            echo "            <table>
                <thead>
                    <tr>
                        <th colspan=\"2\">#</th>
                        <th>";
            // line 24
            echo _gettext("Partition");
            echo "</th>
                        ";
            // line 25
            if (($context["has_description"] ?? null)) {
                // line 26
                echo "                            <th>";
                echo _gettext("Expression");
                echo "</th>
                        ";
            }
            // line 28
            echo "                        <th>";
            echo _gettext("Rows");
            echo "</th>
                        <th>";
            // line 29
            echo _gettext("Data length");
            echo "</th>
                        <th>";
            // line 30
            echo _gettext("Index length");
            echo "</th>
                        <th>";
            // line 31
            echo _gettext("Comment");
            echo "</th>
                        <th colspan=\"";
            // line 32
            echo ((($context["range_or_list"] ?? null)) ? ("7") : ("6"));
            echo "\">
                            ";
            // line 33
            echo _gettext("Action");
            // line 34
            echo "                        </th>
                    </tr>
                </thead>
                <tbody>
                ";
            // line 38
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["partitions"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["partition"]) {
                // line 39
                echo "                    <tr class=\"noclick";
                echo ((($context["has_sub_partitions"] ?? null)) ? (" marked") : (""));
                echo "\">
                        ";
                // line 40
                if (($context["has_sub_partitions"] ?? null)) {
                    // line 41
                    echo "                            <td>";
                    echo twig_escape_filter($this->env, $this->getAttribute($context["partition"], "getOrdinal", array(), "method"), "html", null, true);
                    echo "</td>
                            <td></td>
                        ";
                } else {
                    // line 44
                    echo "                            <td colspan=\"2\">";
                    echo twig_escape_filter($this->env, $this->getAttribute($context["partition"], "getOrdinal", array(), "method"), "html", null, true);
                    echo "</td>
                        ";
                }
                // line 46
                echo "                        <th>";
                echo twig_escape_filter($this->env, $this->getAttribute($context["partition"], "getName", array(), "method"), "html", null, true);
                echo "</th>
                        ";
                // line 47
                if (($context["has_description"] ?? null)) {
                    // line 48
                    echo "                            <td>
                                <code>";
                    // line 50
                    echo twig_escape_filter($this->env, $this->getAttribute($context["partition"], "getExpression", array(), "method"), "html", null, true);
                    // line 51
                    echo ((($this->getAttribute($context["partition"], "getMethod", array(), "method") == "LIST")) ? (" IN (") : (" < "));
                    // line 52
                    echo twig_escape_filter($this->env, $this->getAttribute($context["partition"], "getDescription", array(), "method"), "html", null, true);
                    // line 53
                    echo ((($this->getAttribute($context["partition"], "getMethod", array(), "method") == "LIST")) ? (")") : (""));
                    // line 54
                    echo "</code>
                            </td>
                        ";
                }
                // line 57
                echo "                        <td class=\"value\">";
                echo twig_escape_filter($this->env, $this->getAttribute($context["partition"], "getRows", array(), "method"), "html", null, true);
                echo "</td>
                        <td class=\"value\">
                            ";
                // line 59
                $context["data_length"] = PhpMyAdmin\Util::formatByteDown($this->getAttribute(                // line 60
$context["partition"], "getDataLength", array(), "method"), 3, 1);
                // line 64
                echo "                            <span>";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data_length"] ?? null), 0, array(), "array"), "html", null, true);
                echo "</span>
                            <span class=\"unit\">";
                // line 65
                echo twig_escape_filter($this->env, $this->getAttribute(($context["data_length"] ?? null), 1, array(), "array"), "html", null, true);
                echo "</span>
                        </td>
                        <td class=\"value\">
                            ";
                // line 68
                $context["index_length"] = PhpMyAdmin\Util::formatByteDown($this->getAttribute(                // line 69
$context["partition"], "getIndexLength", array(), "method"), 3, 1);
                // line 73
                echo "                            <span>";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["index_length"] ?? null), 0, array(), "array"), "html", null, true);
                echo "</span>
                            <span class=\"unit\">";
                // line 74
                echo twig_escape_filter($this->env, $this->getAttribute(($context["index_length"] ?? null), 1, array(), "array"), "html", null, true);
                echo "</span>
                        </td>
                        <td>";
                // line 76
                echo twig_escape_filter($this->env, $this->getAttribute($context["partition"], "getComment", array(), "method"), "html", null, true);
                echo "</td>
                        ";
                // line 77
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(($context["action_icons"] ?? null));
                foreach ($context['_seq'] as $context["action"] => $context["icon"]) {
                    // line 78
                    echo "                            <td>
                                <a href=\"tbl_structure.php\" data-post=\"";
                    // line 79
                    echo twig_escape_filter($this->env, ($context["url_query"] ?? null), "html", null, true);
                    // line 80
                    echo "&amp;partition_maintenance=1&amp;sql_query=";
                    // line 81
                    echo twig_escape_filter($this->env, twig_urlencode_filter(((((("ALTER TABLE " . PhpMyAdmin\Util::backquote(($context["table"] ?? null))) . " ") . $context["action"]) . " PARTITION ") . $this->getAttribute(                    // line 82
$context["partition"], "getName", array(), "method"))), "html", null, true);
                    echo "\"
                                    id=\"partition_action_";
                    // line 83
                    echo twig_escape_filter($this->env, $context["action"], "html", null, true);
                    echo "\"
                                    name=\"partition_action_";
                    // line 84
                    echo twig_escape_filter($this->env, $context["action"], "html", null, true);
                    echo "\"
                                    class=\"ajax\">
                                    ";
                    // line 86
                    echo $context["icon"];
                    echo "
                                </a>
                            </td>
                        ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['action'], $context['icon'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 90
                echo "
                        ";
                // line 91
                if (($context["has_sub_partitions"] ?? null)) {
                    // line 92
                    echo "                            ";
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($this->getAttribute($context["partition"], "getSubPartitions", array(), "method"));
                    foreach ($context['_seq'] as $context["_key"] => $context["sub_partition"]) {
                        // line 93
                        echo "                                <tr class=\"noclick\">
                                    <td></td>
                                    <td>";
                        // line 95
                        echo twig_escape_filter($this->env, $this->getAttribute($context["sub_partition"], "getOrdinal", array(), "method"), "html", null, true);
                        echo "</td>
                                    <td>";
                        // line 96
                        echo twig_escape_filter($this->env, $this->getAttribute($context["sub_partition"], "getName", array(), "method"), "html", null, true);
                        echo "</td>
                                    ";
                        // line 97
                        if (($context["has_description"] ?? null)) {
                            // line 98
                            echo "                                        <td></td>
                                    ";
                        }
                        // line 100
                        echo "                                    <td class=\"value\">";
                        echo twig_escape_filter($this->env, $this->getAttribute($context["sub_partition"], "getRows", array(), "method"), "html", null, true);
                        echo "</td>
                                    <td class=\"value\">
                                        ";
                        // line 102
                        $context["data_length"] = PhpMyAdmin\Util::formatByteDown($this->getAttribute(                        // line 103
$context["sub_partition"], "getDataLength", array(), "method"), 3, 1);
                        // line 107
                        echo "                                        <span>";
                        echo twig_escape_filter($this->env, $this->getAttribute(($context["data_length"] ?? null), 0, array(), "array"), "html", null, true);
                        echo "</span>
                                        <span class=\"unit\">";
                        // line 108
                        echo twig_escape_filter($this->env, $this->getAttribute(($context["data_length"] ?? null), 1, array(), "array"), "html", null, true);
                        echo "</span>
                                    </td>
                                    <td class=\"value\">
                                        ";
                        // line 111
                        $context["index_length"] = PhpMyAdmin\Util::formatByteDown($this->getAttribute(                        // line 112
$context["sub_partition"], "getIndexLength", array(), "method"), 3, 1);
                        // line 116
                        echo "                                        <span>";
                        echo twig_escape_filter($this->env, $this->getAttribute(($context["index_length"] ?? null), 0, array(), "array"), "html", null, true);
                        echo "</span>
                                        <span class=\"unit\">";
                        // line 117
                        echo twig_escape_filter($this->env, $this->getAttribute(($context["index_length"] ?? null), 1, array(), "array"), "html", null, true);
                        echo "</span>
                                    </td>
                                    <td>";
                        // line 119
                        echo twig_escape_filter($this->env, $this->getAttribute($context["sub_partition"], "getComment", array(), "method"), "html", null, true);
                        echo "</td>
                                    <td colspan=\"";
                        // line 120
                        echo ((($context["range_or_list"] ?? null)) ? ("7") : ("6"));
                        echo "\"></td>
                                </tr>
                            ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['sub_partition'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 123
                    echo "                        ";
                }
                // line 124
                echo "                    </tr>
                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['partition'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 126
            echo "                </tbody>
            </table>
        ";
        }
        // line 129
        echo "    </fieldset>
    <fieldset class=\"tblFooters print_ignore\">
        <form action=\"tbl_structure.php\" method=\"post\">
            ";
        // line 132
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null), ($context["table"] ?? null));
        echo "
            <input type=\"hidden\" name=\"edit_partitioning\" value=\"true\" />
            ";
        // line 134
        if (twig_test_empty(($context["partitions"] ?? null))) {
            // line 135
            echo "                <input type=\"submit\" name=\"edit_partitioning\" value=\"";
            echo _gettext("Partition table");
            echo "\" />
            ";
        } else {
            // line 137
            echo "                ";
            echo PhpMyAdmin\Util::linkOrButton(($context["remove_url"] ?? null), _gettext("Remove partitioning"), array("class" => "button ajax", "id" => "remove_partitioning"));
            // line 140
            echo "
                <input type=\"submit\" name=\"edit_partitioning\" value=\"";
            // line 141
            echo _gettext("Edit partitioning");
            echo "\" />
            ";
        }
        // line 143
        echo "        </form>
    </fieldset>
</div>
";
    }

    public function getTemplateName()
    {
        return "table/structure/display_partitions.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  353 => 143,  348 => 141,  345 => 140,  342 => 137,  336 => 135,  334 => 134,  329 => 132,  324 => 129,  319 => 126,  312 => 124,  309 => 123,  300 => 120,  296 => 119,  291 => 117,  286 => 116,  284 => 112,  283 => 111,  277 => 108,  272 => 107,  270 => 103,  269 => 102,  263 => 100,  259 => 98,  257 => 97,  253 => 96,  249 => 95,  245 => 93,  240 => 92,  238 => 91,  235 => 90,  225 => 86,  220 => 84,  216 => 83,  212 => 82,  211 => 81,  209 => 80,  207 => 79,  204 => 78,  200 => 77,  196 => 76,  191 => 74,  186 => 73,  184 => 69,  183 => 68,  177 => 65,  172 => 64,  170 => 60,  169 => 59,  163 => 57,  158 => 54,  156 => 53,  154 => 52,  152 => 51,  150 => 50,  147 => 48,  145 => 47,  140 => 46,  134 => 44,  127 => 41,  125 => 40,  120 => 39,  116 => 38,  110 => 34,  108 => 33,  104 => 32,  100 => 31,  96 => 30,  92 => 29,  87 => 28,  81 => 26,  79 => 25,  75 => 24,  69 => 20,  60 => 17,  58 => 16,  55 => 15,  53 => 14,  45 => 12,  43 => 11,  40 => 10,  34 => 8,  32 => 7,  26 => 5,  24 => 4,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "table/structure/display_partitions.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\table\\structure\\display_partitions.twig");
    }
}
