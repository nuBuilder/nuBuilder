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

/* console/display.twig */
class __TwigTemplate_b025030b828837e53929e6700d10bbea extends Template
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
        echo "<div id=\"pma_console_container\" class=\"d-print-none\">
  <div id=\"pma_console\">
    <div class=\"toolbar collapsed\">
      <div class=\"switch_button console_switch\">
        ";
        // line 5
        echo PhpMyAdmin\Html\Generator::getImage("console", _gettext("SQL Query Console"));
        echo "
        <span>";
        // line 6
        echo twig_escape_filter($this->env, _gettext("Console"), "html", null, true);
        echo "</span>
      </div>
      <div class=\"button clear\">
        <span>";
        // line 9
        echo twig_escape_filter($this->env, _gettext("Clear"), "html", null, true);
        echo "</span>
      </div>
      <div class=\"button history\">
        <span>";
        // line 12
        echo twig_escape_filter($this->env, _gettext("History"), "html", null, true);
        echo "</span>
      </div>
      <div class=\"button options\">
        <span>";
        // line 15
        echo twig_escape_filter($this->env, _gettext("Options"), "html", null, true);
        echo "</span>
      </div>
      ";
        // line 17
        if (($context["has_bookmark_feature"] ?? null)) {
            // line 18
            echo "        <div class=\"button bookmarks\">
          <span>";
            // line 19
            echo twig_escape_filter($this->env, _gettext("Bookmarks"), "html", null, true);
            echo "</span>
        </div>
      ";
        }
        // line 22
        echo "      <div class=\"button debug hide\">
        <span>";
        // line 23
        echo twig_escape_filter($this->env, _gettext("Debug SQL"), "html", null, true);
        echo "</span>
      </div>
    </div>

    ";
        // line 28
        echo "    <div class=\"content\">
      <div class=\"console_message_container\">
        <div class=\"message welcome\">
          <span id=\"instructions-0\">";
echo _gettext("Press Ctrl+Enter to execute query");
        // line 31
        echo "</span>
          <span class=\"hide\" id=\"instructions-1\">";
echo _gettext("Press Enter to execute query");
        // line 32
        echo "</span>
        </div>
        ";
        // line 34
        if ( !twig_test_empty(($context["sql_history"] ?? null))) {
            // line 35
            echo "          ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(twig_reverse_filter($this->env, ($context["sql_history"] ?? null)));
            foreach ($context['_seq'] as $context["_key"] => $context["record"]) {
                // line 36
                echo "            <div class=\"message history collapsed hide";
                echo ((preg_match("@^SELECT[[:space:]]+@i", (($__internal_compile_0 = $context["record"]) && is_array($__internal_compile_0) || $__internal_compile_0 instanceof ArrayAccess ? ($__internal_compile_0["sqlquery"] ?? null) : null))) ? (" select") : (""));
                echo "\" targetdb=\"";
                echo twig_escape_filter($this->env, (($__internal_compile_1 = $context["record"]) && is_array($__internal_compile_1) || $__internal_compile_1 instanceof ArrayAccess ? ($__internal_compile_1["db"] ?? null) : null), "html", null, true);
                echo "\" targettable=\"";
                echo twig_escape_filter($this->env, (($__internal_compile_2 = $context["record"]) && is_array($__internal_compile_2) || $__internal_compile_2 instanceof ArrayAccess ? ($__internal_compile_2["table"] ?? null) : null), "html", null, true);
                echo "\">
              <div class=\"action_content\">
                <span class=\"action collapse\">";
                // line 38
                echo twig_escape_filter($this->env, _gettext("Collapse"), "html", null, true);
                echo "</span>
                <span class=\"action expand\">";
                // line 39
                echo twig_escape_filter($this->env, _gettext("Expand"), "html", null, true);
                echo "</span>
                <span class=\"action requery\">";
                // line 40
                echo twig_escape_filter($this->env, _gettext("Requery"), "html", null, true);
                echo "</span>
                <span class=\"action edit\">";
                // line 41
                echo twig_escape_filter($this->env, _gettext("Edit"), "html", null, true);
                echo "</span>
                <span class=\"action explain\">";
                // line 42
                echo twig_escape_filter($this->env, _gettext("Explain"), "html", null, true);
                echo "</span>
                <span class=\"action profiling\">";
                // line 43
                echo twig_escape_filter($this->env, _gettext("Profiling"), "html", null, true);
                echo "</span>
                ";
                // line 44
                if (($context["has_bookmark_feature"] ?? null)) {
                    // line 45
                    echo "                  <span class=\"action bookmark\">";
                    echo twig_escape_filter($this->env, _gettext("Bookmark"), "html", null, true);
                    echo "</span>
                ";
                }
                // line 47
                echo "                <span class=\"text failed\">";
                echo twig_escape_filter($this->env, _gettext("Query failed"), "html", null, true);
                echo "</span>
                <span class=\"text targetdb\">";
                // line 48
                echo twig_escape_filter($this->env, _gettext("Database"), "html", null, true);
                echo ": <span>";
                echo twig_escape_filter($this->env, (($__internal_compile_3 = $context["record"]) && is_array($__internal_compile_3) || $__internal_compile_3 instanceof ArrayAccess ? ($__internal_compile_3["db"] ?? null) : null), "html", null, true);
                echo "</span></span>
                <span class=\"text query_time\">";
                // line 49
                echo twig_escape_filter($this->env, _gettext("Queried time"), "html", null, true);
                echo ": <span>";
                echo twig_escape_filter($this->env, ((twig_get_attribute($this->env, $this->source, $context["record"], "timevalue", [], "array", true, true, false, 49)) ? ((($__internal_compile_4 = $context["record"]) && is_array($__internal_compile_4) || $__internal_compile_4 instanceof ArrayAccess ? ($__internal_compile_4["timevalue"] ?? null) : null)) : (_gettext("During current session"))), "html", null, true);
                echo "</span></span>
              </div>

              <span class=\"query\">";
                // line 52
                echo twig_escape_filter($this->env, (($__internal_compile_5 = $context["record"]) && is_array($__internal_compile_5) || $__internal_compile_5 instanceof ArrayAccess ? ($__internal_compile_5["sqlquery"] ?? null) : null), "html", null, true);
                echo "</span>
            </div>
          ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['record'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 55
            echo "        ";
        }
        // line 56
        echo "      </div><!-- console_message_container -->
      <div class=\"query_input\">
        <span class=\"console_query_input\"></span>
      </div>
    </div><!-- message end -->
    ";
        // line 62
        echo "    <div class=\"mid_layer\"></div>
    ";
        // line 64
        echo "    <div class=\"card\" id=\"debug_console\">
      <div class=\"toolbar\">
        <div class=\"button order order_asc\">
          <span>";
        // line 67
        echo twig_escape_filter($this->env, _gettext("ascending"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"button order order_desc\">
          <span>";
        // line 70
        echo twig_escape_filter($this->env, _gettext("descending"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"text\">
          <span>";
        // line 73
        echo twig_escape_filter($this->env, _gettext("Order:"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"switch_button\">
          <span>";
        // line 76
        echo twig_escape_filter($this->env, _gettext("Debug SQL"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"button order_by sort_count\">
          <span>";
        // line 79
        echo twig_escape_filter($this->env, _gettext("Count"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"button order_by sort_exec\">
          <span>";
        // line 82
        echo twig_escape_filter($this->env, _gettext("Execution order"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"button order_by sort_time\">
          <span>";
        // line 85
        echo twig_escape_filter($this->env, _gettext("Time taken"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"text\">
          <span>";
        // line 88
        echo twig_escape_filter($this->env, _gettext("Order by:"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"button group_queries\">
          <span>";
        // line 91
        echo twig_escape_filter($this->env, _gettext("Group queries"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"button ungroup_queries\">
          <span>";
        // line 94
        echo twig_escape_filter($this->env, _gettext("Ungroup queries"), "html", null, true);
        echo "</span>
        </div>
      </div>

      <div class=\"content debug\">
        <div class=\"message welcome\"></div>
        <div class=\"debugLog\"></div>
      </div> <!-- Content -->
      <div class=\"templates\">
        <div class=\"debug_query action_content\">
          <span class=\"action collapse\">";
        // line 104
        echo twig_escape_filter($this->env, _gettext("Collapse"), "html", null, true);
        echo "</span>
          <span class=\"action expand\">";
        // line 105
        echo twig_escape_filter($this->env, _gettext("Expand"), "html", null, true);
        echo "</span>
          <span class=\"action dbg_show_trace\">";
        // line 106
        echo twig_escape_filter($this->env, _gettext("Show trace"), "html", null, true);
        echo "</span>
          <span class=\"action dbg_hide_trace\">";
        // line 107
        echo twig_escape_filter($this->env, _gettext("Hide trace"), "html", null, true);
        echo "</span>
          <span class=\"text count hide\">";
        // line 108
        echo twig_escape_filter($this->env, _gettext("Count"), "html", null, true);
        echo "</span>
          <span class=\"text time\">";
        // line 109
        echo twig_escape_filter($this->env, _gettext("Time taken"), "html", null, true);
        echo "</span>
        </div>

      </div> <!-- Template -->
    </div> <!-- Debug SQL card -->
    ";
        // line 114
        if (($context["has_bookmark_feature"] ?? null)) {
            // line 115
            echo "      <div class=\"card\" id=\"pma_bookmarks\">
        <div class=\"toolbar\">
          <div class=\"switch_button\">
            <span>";
            // line 118
            echo twig_escape_filter($this->env, _gettext("Bookmarks"), "html", null, true);
            echo "</span>
          </div>
          <div class=\"button refresh\">
            <span>";
            // line 121
            echo twig_escape_filter($this->env, _gettext("Refresh"), "html", null, true);
            echo "</span>
          </div>
          <div class=\"button add\">
            <span>";
            // line 124
            echo twig_escape_filter($this->env, _gettext("Add"), "html", null, true);
            echo "</span>
          </div>
        </div>

        <div class=\"content bookmark\">
          ";
            // line 129
            echo ($context["bookmark_content"] ?? null);
            echo "
        </div>
        <div class=\"mid_layer\"></div>
        <div class=\"card add\">
          <div class=\"toolbar\">
            <div class=\"switch_button\">
              <span>";
            // line 135
            echo twig_escape_filter($this->env, _gettext("Add bookmark"), "html", null, true);
            echo "</span>
            </div>
          </div>

          <div class=\"content add_bookmark\">
            <div class=\"options\">
              <label>
                ";
echo _gettext("Label");
            // line 142
            echo ": <input type=\"text\" name=\"label\">
              </label>
              <label>
                ";
echo _gettext("Target database");
            // line 145
            echo ": <input type=\"text\" name=\"targetdb\">
              </label>
              <label>
                <input type=\"checkbox\" name=\"shared\">";
echo _gettext("Share this bookmark");
            // line 149
            echo "              </label>
              <button class=\"btn btn-primary\" type=\"submit\" name=\"submit\">";
echo _gettext("OK");
            // line 150
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
        // line 159
        echo "    ";
        // line 160
        echo "    <div class=\"card\" id=\"pma_console_options\">
      <div class=\"toolbar\">
        <div class=\"switch_button\">
          <span>";
        // line 163
        echo twig_escape_filter($this->env, _gettext("Options"), "html", null, true);
        echo "</span>
        </div>
        <div class=\"button default\">
          <span>";
        // line 166
        echo twig_escape_filter($this->env, _gettext("Set default"), "html", null, true);
        echo "</span>
        </div>
      </div>

      <div class=\"content\">
        <div class=\"form-check form-switch\">
          <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"consoleOptionsAlwaysExpandCheckbox\" name=\"always_expand\">
          <label class=\"form-check-label\" for=\"consoleOptionsAlwaysExpandCheckbox\">";
        // line 173
        echo twig_escape_filter($this->env, _gettext("Always expand query messages"), "html", null, true);
        echo "</label>
        </div>
        <div class=\"form-check form-switch\">
          <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"consoleOptionsStartHistoryCheckbox\" name=\"start_history\">
          <label class=\"form-check-label\" for=\"consoleOptionsStartHistoryCheckbox\">";
        // line 177
        echo twig_escape_filter($this->env, _gettext("Show query history at start"), "html", null, true);
        echo "</label>
        </div>
        <div class=\"form-check form-switch\">
          <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"consoleOptionsCurrentQueryCheckbox\" name=\"current_query\">
          <label class=\"form-check-label\" for=\"consoleOptionsCurrentQueryCheckbox\">";
        // line 181
        echo twig_escape_filter($this->env, _gettext("Show current browsing query"), "html", null, true);
        echo "</label>
        </div>
        <div class=\"form-check form-switch\">
          <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"consoleOptionsEnterExecutesCheckbox\" name=\"enter_executes\">
          <label class=\"form-check-label\" for=\"consoleOptionsEnterExecutesCheckbox\">";
        // line 185
        echo twig_escape_filter($this->env, _gettext("Execute queries on Enter and insert new line with Shift+Enter. To make this permanent, view settings."), "html", null, true);
        echo "</label>
        </div>
        <div class=\"form-check form-switch\">
          <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"consoleOptionsDarkThemeCheckbox\" name=\"dark_theme\">
          <label class=\"form-check-label\" for=\"consoleOptionsDarkThemeCheckbox\">";
        // line 189
        echo twig_escape_filter($this->env, _gettext("Switch to dark theme"), "html", null, true);
        echo "</label>
        </div>
      </div>
    </div> <!-- Options card -->
    <div class=\"templates\">
      ";
        // line 195
        echo "      <div class=\"query_actions\">
        <span class=\"action collapse\">";
        // line 196
        echo twig_escape_filter($this->env, _gettext("Collapse"), "html", null, true);
        echo "</span>
        <span class=\"action expand\">";
        // line 197
        echo twig_escape_filter($this->env, _gettext("Expand"), "html", null, true);
        echo "</span>
        <span class=\"action requery\">";
        // line 198
        echo twig_escape_filter($this->env, _gettext("Requery"), "html", null, true);
        echo "</span>
        <span class=\"action edit\">";
        // line 199
        echo twig_escape_filter($this->env, _gettext("Edit"), "html", null, true);
        echo "</span>
        <span class=\"action explain\">";
        // line 200
        echo twig_escape_filter($this->env, _gettext("Explain"), "html", null, true);
        echo "</span>
        <span class=\"action profiling\">";
        // line 201
        echo twig_escape_filter($this->env, _gettext("Profiling"), "html", null, true);
        echo "</span>
        ";
        // line 202
        if (($context["has_bookmark_feature"] ?? null)) {
            // line 203
            echo "          <span class=\"action bookmark\">";
            echo twig_escape_filter($this->env, _gettext("Bookmark"), "html", null, true);
            echo "</span>
        ";
        }
        // line 205
        echo "        <span class=\"text failed\">";
        echo twig_escape_filter($this->env, _gettext("Query failed"), "html", null, true);
        echo "</span>
        <span class=\"text targetdb\">";
        // line 206
        echo twig_escape_filter($this->env, _gettext("Database"), "html", null, true);
        echo ": <span></span></span>
        <span class=\"text query_time\">";
        // line 207
        echo twig_escape_filter($this->env, _gettext("Queried time"), "html", null, true);
        echo ": <span></span></span>
      </div>
    </div>
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
        return array (  472 => 207,  468 => 206,  463 => 205,  457 => 203,  455 => 202,  451 => 201,  447 => 200,  443 => 199,  439 => 198,  435 => 197,  431 => 196,  428 => 195,  420 => 189,  413 => 185,  406 => 181,  399 => 177,  392 => 173,  382 => 166,  376 => 163,  371 => 160,  369 => 159,  358 => 150,  354 => 149,  348 => 145,  342 => 142,  331 => 135,  322 => 129,  314 => 124,  308 => 121,  302 => 118,  297 => 115,  295 => 114,  287 => 109,  283 => 108,  279 => 107,  275 => 106,  271 => 105,  267 => 104,  254 => 94,  248 => 91,  242 => 88,  236 => 85,  230 => 82,  224 => 79,  218 => 76,  212 => 73,  206 => 70,  200 => 67,  195 => 64,  192 => 62,  185 => 56,  182 => 55,  173 => 52,  165 => 49,  159 => 48,  154 => 47,  148 => 45,  146 => 44,  142 => 43,  138 => 42,  134 => 41,  130 => 40,  126 => 39,  122 => 38,  112 => 36,  107 => 35,  105 => 34,  101 => 32,  97 => 31,  91 => 28,  84 => 23,  81 => 22,  75 => 19,  72 => 18,  70 => 17,  65 => 15,  59 => 12,  53 => 9,  47 => 6,  43 => 5,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "console/display.twig", "C:\\xampp\\htdocs\\nubuilder4\\core\\libs\\nudb\\templates\\console\\display.twig");
    }
}
