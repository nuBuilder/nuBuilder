<?php

/* console/display.twig */
class __TwigTemplate_e94e390484be53bc9a55eb70ea8d3f256ffb5211f782dfad089d987ca13be249 extends Twig_Template
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
        echo "<div id=\"pma_console_container\">
    <div id=\"pma_console\">
        ";
        // line 4
        echo "        ";
        $this->loadTemplate("console/toolbar.twig", "console/display.twig", 4)->display(array("parent_div_classes" => "collapsed", "content_array" => array(0 => array(0 => "switch_button console_switch", 1 => _gettext("Console"), "image" =>         // line 7
($context["image"] ?? null)), 1 => array(0 => "button clear", 1 => _gettext("Clear")), 2 => array(0 => "button history", 1 => _gettext("History")), 3 => array(0 => "button options", 1 => _gettext("Options")), 4 => ((        // line 11
array_key_exists("cfg_bookmark", $context)) ? (array(0 => "button bookmarks", 1 => _gettext("Bookmarks"))) : (null)), 5 => array(0 => "button debug hide", 1 => _gettext("Debug SQL")))));
        // line 15
        echo "        ";
        // line 16
        echo "        <div class=\"content\">
            <div class=\"console_message_container\">
                <div class=\"message welcome\">
                    <span id=\"instructions-0\">
                        ";
        // line 20
        echo _gettext("Press Ctrl+Enter to execute query");
        // line 21
        echo "                    </span>
                    <span class=\"hide\" id=\"instructions-1\">
                        ";
        // line 23
        echo _gettext("Press Enter to execute query");
        // line 24
        echo "                    </span>
                </div>
                ";
        // line 26
        if ( !twig_test_empty(($context["sql_history"] ?? null))) {
            // line 27
            echo "                    ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(twig_reverse_filter($this->env, ($context["sql_history"] ?? null)));
            foreach ($context['_seq'] as $context["_key"] => $context["record"]) {
                // line 28
                echo "                        <div class=\"message history collapsed hide";
                // line 29
                echo ((preg_match("@^SELECT[[:space:]]+@i", $this->getAttribute($context["record"], "sqlquery", array(), "array"))) ? (" select") : (""));
                echo "\"
                            targetdb=\"";
                // line 30
                echo twig_escape_filter($this->env, $this->getAttribute($context["record"], "db", array(), "array"), "html", null, true);
                echo "\" targettable=\"";
                echo twig_escape_filter($this->env, $this->getAttribute($context["record"], "table", array(), "array"), "html", null, true);
                echo "\">
                            ";
                // line 31
                $this->loadTemplate("console/query_action.twig", "console/display.twig", 31)->display(array("parent_div_classes" => "action_content", "content_array" => array(0 => array(0 => "action collapse", 1 => _gettext("Collapse")), 1 => array(0 => "action expand", 1 => _gettext("Expand")), 2 => array(0 => "action requery", 1 => _gettext("Requery")), 3 => array(0 => "action edit", 1 => _gettext("Edit")), 4 => array(0 => "action explain", 1 => _gettext("Explain")), 5 => array(0 => "action profiling", 1 => _gettext("Profiling")), 6 => ((                // line 40
array_key_exists("cfg_bookmark", $context)) ? (array(0 => "action bookmark", 1 => _gettext("Bookmark"))) : (null)), 7 => array(0 => "text failed", 1 => _gettext("Query failed")), 8 => array(0 => "text targetdb", 1 => _gettext("Database"), "extraSpan" => $this->getAttribute(                // line 42
$context["record"], "db", array(), "array")), 9 => array(0 => "text query_time", 1 => _gettext("Queried time"), "extraSpan" => (($this->getAttribute(                // line 46
$context["record"], "timevalue", array(), "array", true, true)) ? ($this->getAttribute(                // line 47
$context["record"], "timevalue", array(), "array")) : (_gettext("During current session")))))));
                // line 51
                echo "                            <span class=\"query\">";
                echo twig_escape_filter($this->env, $this->getAttribute($context["record"], "sqlquery", array(), "array"), "html", null, true);
                echo "</span>
                        </div>
                    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['record'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 54
            echo "                ";
        }
        // line 55
        echo "            </div><!-- console_message_container -->
            <div class=\"query_input\">
                <span class=\"console_query_input\"></span>
            </div>
        </div><!-- message end -->
        ";
        // line 61
        echo "        <div class=\"mid_layer\"></div>
        ";
        // line 63
        echo "        <div class=\"card\" id=\"debug_console\">
            ";
        // line 64
        $this->loadTemplate("console/toolbar.twig", "console/display.twig", 64)->display(array("parent_div_classes" => "", "content_array" => array(0 => array(0 => "button order order_asc", 1 => _gettext("ascending")), 1 => array(0 => "button order order_desc", 1 => _gettext("descending")), 2 => array(0 => "text", 1 => _gettext("Order:")), 3 => array(0 => "switch_button", 1 => _gettext("Debug SQL")), 4 => array(0 => "button order_by sort_count", 1 => _gettext("Count")), 5 => array(0 => "button order_by sort_exec", 1 => _gettext("Execution order")), 6 => array(0 => "button order_by sort_time", 1 => _gettext("Time taken")), 7 => array(0 => "text", 1 => _gettext("Order by:")), 8 => array(0 => "button group_queries", 1 => _gettext("Group queries")), 9 => array(0 => "button ungroup_queries", 1 => _gettext("Ungroup queries")))));
        // line 79
        echo "            <div class=\"content debug\">
                <div class=\"message welcome\"></div>
                <div class=\"debugLog\"></div>
            </div> <!-- Content -->
            <div class=\"templates\">
                ";
        // line 84
        $this->loadTemplate("console/query_action.twig", "console/display.twig", 84)->display(array("parent_div_classes" => "debug_query action_content", "content_array" => array(0 => array(0 => "action collapse", 1 => _gettext("Collapse")), 1 => array(0 => "action expand", 1 => _gettext("Expand")), 2 => array(0 => "action dbg_show_trace", 1 => _gettext("Show trace")), 3 => array(0 => "action dbg_hide_trace", 1 => _gettext("Hide trace")), 4 => array(0 => "text count hide", 1 => _gettext("Count")), 5 => array(0 => "text time", 1 => _gettext("Time taken")))));
        // line 95
        echo "            </div> <!-- Template -->
        </div> <!-- Debug SQL card -->
        ";
        // line 97
        if (($context["cfg_bookmark"] ?? null)) {
            // line 98
            echo "            <div class=\"card\" id=\"pma_bookmarks\">
                ";
            // line 99
            $this->loadTemplate("console/toolbar.twig", "console/display.twig", 99)->display(array("parent_div_classes" => "", "content_array" => array(0 => array(0 => "switch_button", 1 => _gettext("Bookmarks")), 1 => array(0 => "button refresh", 1 => _gettext("Refresh")), 2 => array(0 => "button add", 1 => _gettext("Add")))));
            // line 107
            echo "                <div class=\"content bookmark\">
                    ";
            // line 108
            echo ($context["bookmark_content"] ?? null);
            echo "
                </div>
                <div class=\"mid_layer\"></div>
                <div class=\"card add\">
                    ";
            // line 112
            $this->loadTemplate("console/toolbar.twig", "console/display.twig", 112)->display(array("parent_div_classes" => "", "content_array" => array(0 => array(0 => "switch_button", 1 => _gettext("Add bookmark")))));
            // line 118
            echo "                    <div class=\"content add_bookmark\">
                        <div class=\"options\">
                            <label>
                                ";
            // line 121
            echo _gettext("Label");
            echo ": <input type=\"text\" name=\"label\">
                            </label>
                            <label>
                                ";
            // line 124
            echo _gettext("Target database");
            echo ": <input type=\"text\" name=\"targetdb\">
                            </label>
                            <label>
                                <input type=\"checkbox\" name=\"shared\">";
            // line 127
            echo _gettext("Share this bookmark");
            // line 128
            echo "                            </label>
                            <button type=\"submit\" name=\"submit\">";
            // line 129
            echo _gettext("OK");
            echo "</button>
                        </div> <!-- options -->
                        <div class=\"query_input\">
                            <span class=\"bookmark_add_input\"></span>
                        </div>
                    </div>
                </div> <!-- Add bookmark card -->
            </div> <!-- Bookmarks card -->
        ";
        }
        // line 138
        echo "        ";
        // line 139
        echo "        <div class=\"card\" id=\"pma_console_options\">
            ";
        // line 140
        $this->loadTemplate("console/toolbar.twig", "console/display.twig", 140)->display(array("parent_div_classes" => "", "content_array" => array(0 => array(0 => "switch_button", 1 => _gettext("Options")), 1 => array(0 => "button default", 1 => _gettext("Set default")))));
        // line 147
        echo "            <div class=\"content\">
                <label>
                    <input type=\"checkbox\" name=\"always_expand\">";
        // line 149
        echo _gettext("Always expand query messages");
        // line 150
        echo "                </label>
                <br>
                <label>
                    <input type=\"checkbox\" name=\"start_history\">";
        // line 153
        echo _gettext("Show query history at start");
        // line 154
        echo "                </label>
                <br>
                <label>
                    <input type=\"checkbox\" name=\"current_query\">";
        // line 157
        echo _gettext("Show current browsing query");
        // line 158
        echo "                </label>
                <br>
                <label>
                    <input type=\"checkbox\" name=\"enter_executes\">
                        ";
        // line 162
        echo _gettext("Execute queries on Enter and insert new line with Shift + Enter. To make this permanent, view settings.");
        // line 165
        echo "                </label>
                <br>
                <label>
                    <input type=\"checkbox\" name=\"dark_theme\">";
        // line 168
        echo _gettext("Switch to dark theme");
        // line 169
        echo "                </label>
                <br>
            </div>
        </div> <!-- Options card -->
        <div class=\"templates\">
            ";
        // line 175
        echo "            ";
        $this->loadTemplate("console/query_action.twig", "console/display.twig", 175)->display(array("parent_div_classes" => "query_actions", "content_array" => array(0 => array(0 => "action collapse", 1 => _gettext("Collapse")), 1 => array(0 => "action expand", 1 => _gettext("Expand")), 2 => array(0 => "action requery", 1 => _gettext("Requery")), 3 => array(0 => "action edit", 1 => _gettext("Edit")), 4 => array(0 => "action explain", 1 => _gettext("Explain")), 5 => array(0 => "action profiling", 1 => _gettext("Profiling")), 6 => ((        // line 184
array_key_exists("cfg_bookmark", $context)) ? (array(0 => "action bookmark", 1 => _gettext("Bookmark"))) : (null)), 7 => array(0 => "text failed", 1 => _gettext("Query failed")), 8 => array(0 => "text targetdb", 1 => _gettext("Database")), 9 => array(0 => "text query_time", 1 => _gettext("Queried time")))));
        // line 190
        echo "        </div>
    </div> <!-- #console end -->
</div> <!-- #console_container end -->
";
    }

    public function getTemplateName()
    {
        return "console/display.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  220 => 190,  218 => 184,  216 => 175,  209 => 169,  207 => 168,  202 => 165,  200 => 162,  194 => 158,  192 => 157,  187 => 154,  185 => 153,  180 => 150,  178 => 149,  174 => 147,  172 => 140,  169 => 139,  167 => 138,  155 => 129,  152 => 128,  150 => 127,  144 => 124,  138 => 121,  133 => 118,  131 => 112,  124 => 108,  121 => 107,  119 => 99,  116 => 98,  114 => 97,  110 => 95,  108 => 84,  101 => 79,  99 => 64,  96 => 63,  93 => 61,  86 => 55,  83 => 54,  73 => 51,  71 => 47,  70 => 46,  69 => 42,  68 => 40,  67 => 31,  61 => 30,  57 => 29,  55 => 28,  50 => 27,  48 => 26,  44 => 24,  42 => 23,  38 => 21,  36 => 20,  30 => 16,  28 => 15,  26 => 11,  25 => 7,  23 => 4,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "console/display.twig", "C:\\xampp\\htdocs\\nubuilder4\\nudb\\templates\\console\\display.twig");
    }
}
