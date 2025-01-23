<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* export.twig */
class __TwigTemplate_c6ef20ac709afaa34299bf26c6fd170f extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'message' => [$this, 'block_message'],
            'selection_options' => [$this, 'block_selection_options'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        yield "<div class=\"container\">
  <h2 class=\"my-3\">
    ";
        // line 3
        yield PhpMyAdmin\Html\Generator::getImage("b_export", _gettext("Export"));
        yield "
    ";
        // line 4
        yield from $this->unwrap()->yieldBlock('title', $context, $blocks);
        // line 5
        yield "  </h2>

  ";
        // line 7
        yield ($context["page_settings_error_html"] ?? null);
        yield "
  ";
        // line 8
        yield ($context["page_settings_html"] ?? null);
        yield "

  ";
        // line 10
        yield from $this->unwrap()->yieldBlock('message', $context, $blocks);
        // line 11
        yield "
  ";
        // line 12
        if (CoreExtension::getAttribute($this->env, $this->source, ($context["templates"] ?? null), "is_enabled", [], "any", false, false, false, 12)) {
            // line 13
            yield "    <div class=\"card mb-3\">
      <div class=\"card-header\">";
yield _gettext("Export templates:");
            // line 14
            yield "</div>
      <div class=\"card-body row gy-3\">
        <form method=\"post\" action=\"";
            // line 16
            yield PhpMyAdmin\Url::getFromRoute("/export/template/create");
            yield "\" class=\"col-12 col-md ajax\">
          <fieldset>
            <legend>";
yield _gettext("New template:");
            // line 18
            yield "</legend>
            <div class=\"row g-3 align-items-center\">
              <div class=\"col-auto\">
                <label for=\"templateName\" class=\"col-form-label\">";
yield _gettext("Template name");
            // line 21
            yield "</label>
              </div>
              <div class=\"col-auto\">
                <input class=\"form-control\" type=\"text\" name=\"templateName\" id=\"templateName\" maxlength=\"64\" placeholder=\"";
yield _gettext("Template name");
            // line 24
            yield "\" required>
              </div>
              <div class=\"col-auto\">
                <input class=\"btn btn-secondary\" type=\"submit\" name=\"createTemplate\" id=\"createTemplate\" value=\"";
yield _gettext("Create");
            // line 27
            yield "\">
              </div>
            </div>
          </fieldset>
        </form>

        <form method=\"post\" id=\"existingTemplatesForm\" class=\"col-12 col-md ajax\">
          <fieldset>
            <legend>";
yield _gettext("Existing templates:");
            // line 35
            yield "</legend>
            <div class=\"row g-3 align-items-center\">
              <div class=\"col-auto\">
                <label for=\"template\" class=\"col-form-label\">";
yield _gettext("Template:");
            // line 38
            yield "</label>
              </div>
              <div class=\"col-auto\">
                <select class=\"form-select\" name=\"template\" id=\"template\" required>
                  <option value=\"\">-- ";
yield _gettext("Select a template");
            // line 42
            yield " --</option>
                  ";
            // line 43
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable(CoreExtension::getAttribute($this->env, $this->source, ($context["templates"] ?? null), "templates", [], "any", false, false, false, 43));
            foreach ($context['_seq'] as $context["_key"] => $context["template"]) {
                // line 44
                yield "                    <option value=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["template"], "getId", [], "method", false, false, false, 44), "html", null, true);
                yield "\"";
                yield (((CoreExtension::getAttribute($this->env, $this->source, $context["template"], "getId", [], "method", false, false, false, 44) == CoreExtension::getAttribute($this->env, $this->source, ($context["templates"] ?? null), "selected", [], "any", false, false, false, 44))) ? (" selected") : (""));
                yield ">
                      ";
                // line 45
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["template"], "getName", [], "method", false, false, false, 45), "html", null, true);
                yield "
                    </option>
                  ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['template'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 48
            yield "                </select>
              </div>
              <div class=\"col-auto\">
                <input class=\"btn btn-secondary\" type=\"submit\" formaction=\"";
            // line 51
            yield PhpMyAdmin\Url::getFromRoute("/export/template/update");
            yield "\" name=\"updateTemplate\" id=\"updateTemplate\" value=\"";
yield _gettext("Update");
            yield "\">
              </div>
              <div class=\"col-auto\">
                <input class=\"btn btn-secondary\" type=\"submit\" formaction=\"";
            // line 54
            yield PhpMyAdmin\Url::getFromRoute("/export/template/delete");
            yield "\" name=\"deleteTemplate\" id=\"deleteTemplate\" value=\"";
yield _gettext("Delete");
            yield "\">
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  ";
        }
        // line 62
        yield "
  ";
        // line 63
        if ( !Twig\Extension\CoreExtension::testEmpty(($context["sql_query"] ?? null))) {
            // line 64
            yield "    <div class=\"card mb-3\">
      <div class=\"card-header\">
        ";
            // line 67
            yield "        ";
yield _gettext("SQL query:");
            // line 68
            yield "      </div>
      <div class=\"card-body\">
        <div id=\"sqlqueryform\">
          ";
            // line 72
            yield "          <input class=\"btn btn-secondary\" type=\"submit\" id=\"showsqlquery\" value=\"";
yield _gettext("Show SQL query");
            yield "\">
        </div>
        <div class=\"d-none\"></div>
      </div>
    </div>
    <div class=\"modal fade\" id=\"showSqlQueryModal\" tabindex=\"-1\" aria-labelledby=\"showSqlQueryModalLabel\" aria-hidden=\"true\">
      <div class=\"modal-dialog\">
        <div class=\"modal-content\">
          <div class=\"modal-header\">
            <h5 class=\"modal-title\" id=\"showSqlQueryModalLabel\">";
yield _gettext("Loading");
            // line 81
            yield "</h5>
            <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
yield _gettext("Close");
            // line 82
            yield "\"></button>
          </div>
          <div class=\"modal-body\">
            <div id=\"export_sql_modal_content\">
              <code class=\"sql\">
                <pre id=\"sql_preview_query\">";
            // line 87
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["sql_query"] ?? null), "html", null, true);
            yield "</pre>
              </code>
            </div>
          </div>
          <div class=\"modal-footer\">
            <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">";
yield _gettext("Close");
            // line 92
            yield "</button>
          </div>
        </div>
      </div>
    </div>
  ";
        }
        // line 98
        yield "
  <form method=\"post\" action=\"";
        // line 99
        yield PhpMyAdmin\Url::getFromRoute("/export");
        yield "\" name=\"dump\" class=\"disableAjax\">
    ";
        // line 100
        yield PhpMyAdmin\Url::getHiddenInputs(($context["hidden_inputs"] ?? null));
        yield "

    ";
        // line 102
        if ((($context["export_method"] ?? null) != "custom-no-form")) {
            // line 103
            yield "      <div class=\"card mb-3\" id=\"quick_or_custom\">
        <div class=\"card-header\">";
yield _gettext("Export method:");
            // line 104
            yield "</div>
        <div class=\"card-body\">
          <div class=\"form-check\">
            <input class=\"form-check-input\" type=\"radio\" name=\"quick_or_custom\" value=\"quick\" id=\"radio_quick_export\"";
            // line 107
            yield (((($context["export_method"] ?? null) == "quick")) ? (" checked") : (""));
            yield ">
            <label class=\"form-check-label\" for=\"radio_quick_export\">";
yield _gettext("Quick - display only the minimal options");
            // line 108
            yield "</label>
          </div>
          <div class=\"form-check\">
            <input class=\"form-check-input\" type=\"radio\" name=\"quick_or_custom\" value=\"custom\" id=\"radio_custom_export\"";
            // line 111
            yield (((($context["export_method"] ?? null) == "custom")) ? (" checked") : (""));
            yield ">
            <label class=\"form-check-label\" for=\"radio_custom_export\">";
yield _gettext("Custom - display all possible options");
            // line 112
            yield "</label>
          </div>
        </div>
      </div>
    ";
        }
        // line 117
        yield "
    <div class=\"card mb-3\" id=\"format\">
      <div class=\"card-header\">";
yield _gettext("Format:");
        // line 119
        yield "</div>
      <div class=\"card-body\">
        <select class=\"form-select\" id=\"plugins\" name=\"what\" aria-label=\"";
yield _gettext("File format to export");
        // line 121
        yield "\">
          ";
        // line 122
        $context['_parent'] = $context;
        $context['_seq'] = CoreExtension::ensureTraversable(($context["plugins_choice"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["option"]) {
            // line 123
            yield "            <option value=\"";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["option"], "name", [], "any", false, false, false, 123), "html", null, true);
            yield "\"";
            yield ((CoreExtension::getAttribute($this->env, $this->source, $context["option"], "is_selected", [], "any", false, false, false, 123)) ? (" selected") : (""));
            yield ">";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["option"], "text", [], "any", false, false, false, 123), "html", null, true);
            yield "</option>
          ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['option'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 125
        yield "        </select>

        ";
        // line 127
        $context['_parent'] = $context;
        $context['_seq'] = CoreExtension::ensureTraversable(($context["plugins_choice"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["option"]) {
            // line 128
            yield "          <input type=\"hidden\" id=\"force_file_";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["option"], "name", [], "any", false, false, false, 128), "html", null, true);
            yield "\" value=\"";
            yield ((CoreExtension::getAttribute($this->env, $this->source, $context["option"], "force_file", [], "any", false, false, false, 128)) ? ("true") : ("false"));
            yield "\">
        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['option'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 130
        yield "      </div>
    </div>

    ";
        // line 133
        yield from $this->unwrap()->yieldBlock('selection_options', $context, $blocks);
        // line 134
        yield "
    ";
        // line 135
        if ( !Twig\Extension\CoreExtension::testEmpty(($context["rows"] ?? null))) {
            // line 136
            yield "      <div class=\"card mb-3\" id=\"rows\">
        <div class=\"card-header\">";
yield _gettext("Rows:");
            // line 137
            yield "</div>
        <div class=\"card-body\">
          <div class=\"form-check\">
            <input class=\"form-check-input\" type=\"radio\" name=\"allrows\" value=\"1\" id=\"radio_allrows_1\"";
            // line 140
            yield ((((null === CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "allrows", [], "any", false, false, false, 140)) || (CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "allrows", [], "any", false, false, false, 140) == 1))) ? (" checked") : (""));
            yield ">
            <label class=\"form-check-label\" for=\"radio_allrows_1\">";
yield _gettext("Dump all rows");
            // line 141
            yield "</label>
          </div>
          <div class=\"form-check mb-2\">
            <input class=\"form-check-input\" type=\"radio\" name=\"allrows\" value=\"0\" id=\"radio_allrows_0\"";
            // line 144
            yield ((( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "allrows", [], "any", false, false, false, 144)) && (CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "allrows", [], "any", false, false, false, 144) == 0))) ? (" checked") : (""));
            yield ">
            <label class=\"form-check-label\" for=\"radio_allrows_0\">";
yield _gettext("Dump some row(s)");
            // line 145
            yield "</label>
          </div>
          <ul class=\"list-group\">
            <li class=\"list-group-item\">
              <label class=\"form-label\" for=\"limit_to\">";
yield _gettext("Number of rows:");
            // line 149
            yield "</label>
              <input class=\"form-control\" type=\"text\" id=\"limit_to\" name=\"limit_to\" size=\"5\" value=\"";
            // line 151
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "limit_to", [], "any", false, false, false, 151))) {
                // line 152
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "limit_to", [], "any", false, false, false, 152), "html", null, true);
            } elseif (( !Twig\Extension\CoreExtension::testEmpty(CoreExtension::getAttribute($this->env, $this->source,             // line 153
($context["rows"] ?? null), "unlim_num_rows", [], "any", false, false, false, 153)) && (CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "unlim_num_rows", [], "any", false, false, false, 153) != 0))) {
                // line 154
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "unlim_num_rows", [], "any", false, false, false, 154), "html", null, true);
            } else {
                // line 156
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "number_of_rows", [], "any", false, false, false, 156), "html", null, true);
            }
            // line 157
            yield "\" onfocus=\"this.select()\">
            </li>
            <li class=\"list-group-item\">
              <label class=\"form-label\" for=\"limit_from\">";
yield _gettext("Row to begin at:");
            // line 160
            yield "</label>
              <input class=\"form-control\" type=\"text\" id=\"limit_from\" name=\"limit_from\" size=\"5\" value=\"";
            // line 161
            (( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "limit_from", [], "any", false, false, false, 161))) ? (yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, ($context["rows"] ?? null), "limit_from", [], "any", false, false, false, 161), "html", null, true)) : (yield 0));
            yield "\" onfocus=\"this.select()\">
            </li>
          </ul>
        </div>
      </div>
    ";
        }
        // line 167
        yield "
    ";
        // line 168
        if (($context["has_save_dir"] ?? null)) {
            // line 169
            yield "      <div class=\"card mb-3 d-none\" id=\"output_quick_export\">
        <div class=\"card-header\">";
yield _gettext("Output:");
            // line 170
            yield "</div>
        <div class=\"card-body\">
          <div class=\"form-check form-switch\">
            <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" name=\"quick_export_onserver\" value=\"saveit\" id=\"checkbox_quick_dump_onserver\"";
            // line 173
            yield ((($context["export_is_checked"] ?? null)) ? (" checked") : (""));
            yield ">
            <label class=\"form-check-label\" for=\"checkbox_quick_dump_onserver\">
              ";
            // line 175
            yield Twig\Extension\CoreExtension::sprintf(_gettext("Save on server in the directory <strong>%s</strong>"), $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["save_dir"] ?? null)));
            yield "
            </label>
          </div>
          <div class=\"form-check form-switch\">
            <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" name=\"quick_export_onserver_overwrite\" value=\"saveitover\" id=\"checkbox_quick_dump_onserver_overwrite\"";
            // line 180
            yield ((($context["export_overwrite_is_checked"] ?? null)) ? (" checked") : (""));
            yield ">
            <label class=\"form-check-label\" for=\"checkbox_quick_dump_onserver_overwrite\">
              ";
yield _gettext("Overwrite existing file(s)");
            // line 183
            yield "            </label>
          </div>
        </div>
      </div>
    ";
        }
        // line 188
        yield "
    <div class=\"modal fade\" id=\"renameExportModal\" tabindex=\"-1\" aria-labelledby=\"renameExportModalLabel\" aria-hidden=\"true\">
      <div class=\"modal-dialog modal-xl\">
        <div class=\"modal-content\">
          <div class=\"modal-header\">
            <h5 class=\"modal-title\" id=\"renameExportModalLabel\">";
yield _gettext("Rename exported databases/tables/columns");
        // line 193
        yield "</h5>
            <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
yield _gettext("Close");
        // line 194
        yield "\"></button>
          </div>
          <div class=\"modal-body overflow-auto\">
            <table class=\"table align-middle mb-3\" id=\"alias_data\">
              <thead>
                <tr>
                  <th colspan=\"4\">
                    ";
yield _gettext("Defined aliases");
        // line 202
        yield "                  </th>
                </tr>
              </thead>

              <tbody>
                ";
        // line 207
        $context['_parent'] = $context;
        $context['_seq'] = CoreExtension::ensureTraversable(($context["aliases"] ?? null));
        foreach ($context['_seq'] as $context["db"] => $context["db_data"]) {
            // line 208
            yield "                  ";
            if ((CoreExtension::getAttribute($this->env, $this->source, $context["db_data"], "alias", [], "any", true, true, false, 208) &&  !(null === CoreExtension::getAttribute($this->env, $this->source, $context["db_data"], "alias", [], "any", false, false, false, 208)))) {
                // line 209
                yield "                    <tr>
                      <th>";
yield _pgettext("Alias", "Database");
                // line 210
                yield "</th>
                      <td>";
                // line 211
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["db"], "html", null, true);
                yield "</td>
                      <td>
                        <input name=\"aliases[";
                // line 213
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["db"], "html", null, true);
                yield "][alias]\" value=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["db_data"], "alias", [], "any", false, false, false, 213), "html", null, true);
                yield "\" type=\"text\">
                      </td>
                      <td>
                        <button class=\"alias_remove btn btn-secondary\">";
yield _gettext("Remove");
                // line 216
                yield "</button>
                      </td>
                    </tr>
                  ";
            }
            // line 220
            yield "
                  ";
            // line 221
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable((((CoreExtension::getAttribute($this->env, $this->source, $context["db_data"], "tables", [], "any", true, true, false, 221) &&  !(null === CoreExtension::getAttribute($this->env, $this->source, $context["db_data"], "tables", [], "any", false, false, false, 221)))) ? (CoreExtension::getAttribute($this->env, $this->source, $context["db_data"], "tables", [], "any", false, false, false, 221)) : ([])));
            foreach ($context['_seq'] as $context["table"] => $context["table_data"]) {
                // line 222
                yield "                    ";
                if ((CoreExtension::getAttribute($this->env, $this->source, $context["table_data"], "alias", [], "any", true, true, false, 222) &&  !(null === CoreExtension::getAttribute($this->env, $this->source, $context["table_data"], "alias", [], "any", false, false, false, 222)))) {
                    // line 223
                    yield "                      <tr>
                        <th>";
yield _pgettext("Alias", "Table");
                    // line 224
                    yield "</th>
                        <td>";
                    // line 225
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["db"], "html", null, true);
                    yield ".";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["table"], "html", null, true);
                    yield "</td>
                        <td>
                          <input name=\"aliases[";
                    // line 227
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["db"], "html", null, true);
                    yield "][tables][";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["table"], "html", null, true);
                    yield "][alias]\" value=\"";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["table_data"], "alias", [], "any", false, false, false, 227), "html", null, true);
                    yield "\" type=\"text\">
                        </td>
                        <td>
                          <button class=\"alias_remove btn btn-secondary\">";
yield _gettext("Remove");
                    // line 230
                    yield "</button>
                        </td>
                      </tr>
                    ";
                }
                // line 234
                yield "
                    ";
                // line 235
                $context['_parent'] = $context;
                $context['_seq'] = CoreExtension::ensureTraversable((((CoreExtension::getAttribute($this->env, $this->source, $context["table_data"], "columns", [], "any", true, true, false, 235) &&  !(null === CoreExtension::getAttribute($this->env, $this->source, $context["table_data"], "columns", [], "any", false, false, false, 235)))) ? (CoreExtension::getAttribute($this->env, $this->source, $context["table_data"], "columns", [], "any", false, false, false, 235)) : ([])));
                foreach ($context['_seq'] as $context["column"] => $context["column_name"]) {
                    // line 236
                    yield "                      <tr>
                        <th>";
yield _pgettext("Alias", "Column");
                    // line 237
                    yield "</th>
                        <td>";
                    // line 238
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["db"], "html", null, true);
                    yield ".";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["table"], "html", null, true);
                    yield ".";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["column"], "html", null, true);
                    yield "</td>
                        <td>
                          <input name=\"aliases[";
                    // line 240
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["db"], "html", null, true);
                    yield "][tables][";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["table"], "html", null, true);
                    yield "][colums][";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["column"], "html", null, true);
                    yield "]\" value=\"";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["column_name"], "html", null, true);
                    yield "\" type=\"text\">
                        </td>
                        <td>
                          <button class=\"alias_remove btn btn-secondary\">";
yield _gettext("Remove");
                    // line 243
                    yield "</button>
                        </td>
                      </tr>
                    ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['column'], $context['column_name'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 247
                yield "                  ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['table'], $context['table_data'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 248
            yield "                ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['db'], $context['db_data'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 249
        yield "              </tbody>

              ";
        // line 252
        yield "              <tfoot class=\"hide\">
                <tr>
                  <th></th>
                  <td></td>
                  <td>
                    <input name=\"aliases_new\" value=\"\" type=\"text\">
                  </td>
                  <td>
                    <button class=\"alias_remove btn btn-secondary\">";
yield _gettext("Remove");
        // line 260
        yield "</button>
                  </td>
                </tr>
              </tfoot>
            </table>

            <table class=\"table align-middle\">
              <thead>
                <tr>
                  <th colspan=\"4\">";
yield _gettext("Define new aliases");
        // line 269
        yield "</th>
                </tr>
              </thead>
              <tr>
                <td>
                  <label>";
yield _gettext("Select database:");
        // line 274
        yield "</label>
                </td>
                <td>
                  <select id=\"db_alias_select\">
                    <option value=\"\"></option>
                  </select>
                </td>
                <td>
                  <input id=\"db_alias_name\" placeholder=\"";
yield _gettext("New database name");
        // line 282
        yield "\" disabled=\"1\">
                </td>
                <td>
                  <button id=\"db_alias_button\" class=\"btn btn-secondary\" disabled=\"1\">";
yield _gettext("Add");
        // line 285
        yield "</button>
                </td>
              </tr>
              <tr>
                <td>
                  <label>";
yield _gettext("Select table:");
        // line 290
        yield "</label>
                </td>
                <td>
                  <select id=\"table_alias_select\">
                    <option value=\"\"></option>
                  </select>
                </td>
                <td>
                  <input id=\"table_alias_name\" placeholder=\"";
yield _gettext("New table name");
        // line 298
        yield "\" disabled=\"1\">
                </td>
                <td>
                  <button id=\"table_alias_button\" class=\"btn btn-secondary\" disabled=\"1\">";
yield _gettext("Add");
        // line 301
        yield "</button>
                </td>
              </tr>
              <tr>
                <td>
                  <label>";
yield _gettext("Select column:");
        // line 306
        yield "</label>
                </td>
                <td>
                  <select id=\"column_alias_select\">
                    <option value=\"\"></option>
                  </select>
                </td>
                <td>
                  <input id=\"column_alias_name\" placeholder=\"";
yield _gettext("New column name");
        // line 314
        yield "\" disabled=\"1\">
                </td>
                <td>
                  <button id=\"column_alias_button\" class=\"btn btn-secondary\" disabled=\"1\">";
yield _gettext("Add");
        // line 317
        yield "</button>
                </td>
              </tr>
            </table>
          </div>
          <div class=\"modal-footer\">
            <button type=\"button\" class=\"btn btn-secondary\" id=\"saveAndCloseBtn\" data-bs-dismiss=\"modal\">
              ";
yield _gettext("Save & close");
        // line 325
        yield "            </button>
          </div>
        </div>
      </div>
    </div>

    <div class=\"card mb-3\" id=\"output\">
      <div class=\"card-header\">";
yield _gettext("Output:");
        // line 332
        yield "</div>
      <ul class=\"list-group list-group-flush\">
        <li class=\"list-group-item\">
          <div class=\"form-check form-switch\">
            <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"btn_alias_config\"";
        // line 336
        yield ((($context["has_aliases"] ?? null)) ? (" checked") : (""));
        yield ">
            <label class=\"form-check-label\" for=\"btn_alias_config\">";
yield _gettext("Rename exported databases/tables/columns");
        // line 337
        yield "</label>
          </div>
        </li>

        ";
        // line 341
        if ((($context["export_type"] ?? null) != "server")) {
            // line 342
            yield "          <li class=\"list-group-item\">
            <div class=\"form-check form-switch\">
              <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" name=\"lock_tables\" value=\"something\" id=\"checkbox_lock_tables\"";
            // line 345
            yield (((( !($context["repopulate"] ?? null) && ($context["is_checked_lock_tables"] ?? null)) || ($context["lock_tables"] ?? null))) ? (" checked") : (""));
            yield ">
              <label class=\"form-check-label\" for=\"checkbox_lock_tables\">
                ";
            // line 347
            yield Twig\Extension\CoreExtension::sprintf(_gettext("Use %s statement"), "<code>LOCK TABLES</code>");
            yield "
              </label>
            </div>
          </li>
        ";
        }
        // line 352
        yield "
        <li class=\"list-group-item\">
          <div class=\"form-check\">
            <input class=\"form-check-input\" type=\"radio\" id=\"radio_view_as_text\" name=\"output_format\" value=\"astext\"";
        // line 355
        yield (((($context["repopulate"] ?? null) || (($context["export_asfile"] ?? null) == false))) ? (" checked") : (""));
        yield ">
            <label class=\"form-check-label\" for=\"radio_view_as_text\">";
yield _gettext("View output as text");
        // line 356
        yield "</label>
          </div>
          <div class=\"form-check mb-2\">
            <input class=\"form-check-input\" type=\"radio\" name=\"output_format\" value=\"sendit\" id=\"radio_dump_asfile\"";
        // line 359
        yield ((( !($context["repopulate"] ?? null) && ($context["is_checked_asfile"] ?? null))) ? (" checked") : (""));
        yield ">
            <label class=\"form-check-label\" for=\"radio_dump_asfile\">";
yield _gettext("Save output to a file");
        // line 360
        yield "</label>
          </div>
          <div class=\"hstack gap-3\">
            <div class=\"vr\"></div>
            <ul class=\"list-group\" id=\"ul_save_asfile\">
              ";
        // line 365
        if (($context["has_save_dir"] ?? null)) {
            // line 366
            yield "                <li class=\"list-group-item\">
                  <div class=\"form-check form-switch\">
                    <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" name=\"onserver\" value=\"saveit\" id=\"checkbox_dump_onserver\"";
            // line 368
            yield ((($context["is_checked_export"] ?? null)) ? (" checked") : (""));
            yield ">
                    <label class=\"form-check-label\" for=\"checkbox_dump_onserver\">
                      ";
            // line 370
            yield Twig\Extension\CoreExtension::sprintf(_gettext("Save on server in the directory <strong>%s</strong>"), $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["save_dir"] ?? null)));
            yield "
                    </label>
                  </div>
                  <div class=\"form-check form-switch\">
                    <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" name=\"onserver_overwrite\" value=\"saveitover\" id=\"checkbox_dump_onserver_overwrite\"";
            // line 375
            yield ((($context["is_checked_export_overwrite"] ?? null)) ? (" checked") : (""));
            yield ">
                    <label class=\"form-check-label\" for=\"checkbox_dump_onserver_overwrite\">
                      ";
yield _gettext("Overwrite existing file(s)");
            // line 378
            yield "                    </label>
                  </div>
                </li>
              ";
        }
        // line 382
        yield "
              <li class=\"list-group-item\">
                <div class=\"row g-3 align-items-center\">
                  <div class=\"col-auto\">
                    <label for=\"filename_template\" class=\"col-form-label\">
                      ";
yield _gettext("File name template:");
        // line 388
        yield "                      ";
        yield PhpMyAdmin\Html\Generator::showHint(Twig\Extension\CoreExtension::sprintf(_gettext("This value is interpreted using the 'strftime' function, so you can use time formatting strings. Additionally the following transformations will happen: %s Other text will be kept as is. See the FAQ 6.27 for details."), ($context["filename_hint"] ?? null)));
        yield "
                    </label>
                  </div>
                  <div class=\"col-auto\">
                    <input type=\"text\" class=\"form-control\" name=\"filename_template\" id=\"filename_template\" value=\"";
        // line 392
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["filename_template"] ?? null), "html", null, true);
        yield "\">
                  </div>
                  <div class=\"col-auto\">
                    <div class=\"form-check form-switch\">
                      <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" name=\"remember_template\" id=\"checkbox_remember_template\"";
        // line 396
        yield ((($context["is_checked_remember_file_template"] ?? null)) ? (" checked") : (""));
        yield ">
                      <label class=\"form-check-label\" for=\"checkbox_remember_template\">
                        ";
yield _gettext("Use this for future exports");
        // line 399
        yield "                      </label>
                    </div>
                  </div>
                </div>
              </li>

              ";
        // line 405
        if (($context["is_encoding_supported"] ?? null)) {
            // line 406
            yield "                <li class=\"list-group-item\">
                  <div class=\"row\">
                    <div class=\"col-auto\">
                      <label for=\"select_charset\" class=\"col-form-label\">";
yield _gettext("Character set of the file:");
            // line 409
            yield "</label>
                    </div>
                    <div class=\"col-auto\">
                      <select class=\"form-select\" id=\"select_charset\" name=\"charset\">
                        ";
            // line 413
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable(($context["encodings"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["charset"]) {
                // line 414
                yield "                          <option value=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["charset"], "html", null, true);
                yield "\"";
                // line 415
                yield ((((Twig\Extension\CoreExtension::testEmpty(($context["export_charset"] ?? null)) && ($context["charset"] == "utf-8")) || ($context["charset"] == ($context["export_charset"] ?? null)))) ? (" selected") : (""));
                yield ">";
                // line 416
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["charset"], "html", null, true);
                // line 417
                yield "</option>
                        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['charset'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 419
            yield "                      </select>
                    </div>
                  </div>
                </li>
              ";
        }
        // line 424
        yield "
              ";
        // line 425
        if ((($context["has_zip"] ?? null) || ($context["has_gzip"] ?? null))) {
            // line 426
            yield "                <li class=\"list-group-item\">
                  <div class=\"row\">
                    <div class=\"col-auto\">
                      <label for=\"compression\" class=\"col-form-label\">";
yield _gettext("Compression:");
            // line 429
            yield "</label>
                    </div>
                    <div class=\"col-auto\">
                      <select class=\"form-select\" id=\"compression\" name=\"compression\">
                        <option value=\"none\">";
yield _gettext("None");
            // line 433
            yield "</option>
                        ";
            // line 434
            if (($context["has_zip"] ?? null)) {
                // line 435
                yield "                          <option value=\"zip\"";
                // line 436
                yield (((($context["selected_compression"] ?? null) == "zip")) ? (" selected") : (""));
                yield ">
                            ";
yield _gettext("zipped");
                // line 438
                yield "                          </option>
                        ";
            }
            // line 440
            yield "                        ";
            if (($context["has_gzip"] ?? null)) {
                // line 441
                yield "                          <option value=\"gzip\"";
                // line 442
                yield (((($context["selected_compression"] ?? null) == "gzip")) ? (" selected") : (""));
                yield ">
                            ";
yield _gettext("gzipped");
                // line 444
                yield "                          </option>
                        ";
            }
            // line 446
            yield "                      </select>
                    </div>
                  </div>
                </li>
              ";
        } else {
            // line 451
            yield "                <input type=\"hidden\" name=\"compression\" value=\"";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["selected_compression"] ?? null), "html", null, true);
            yield "\">
              ";
        }
        // line 453
        yield "
              ";
        // line 454
        if (((($context["export_type"] ?? null) == "server") || (($context["export_type"] ?? null) == "database"))) {
            // line 455
            yield "                <li class=\"list-group-item\">
                  <div class=\"form-check form-switch\">
                    <input class=\"form-check-input\" type=\"checkbox\" role=\"switch\" id=\"checkbox_as_separate_files\" name=\"as_separate_files\" value=\"";
            // line 457
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["export_type"] ?? null), "html", null, true);
            yield "\"";
            // line 458
            yield ((($context["is_checked_as_separate_files"] ?? null)) ? (" checked") : (""));
            yield ">
                    <label class=\"form-check-label\" for=\"checkbox_as_separate_files\">
                      ";
            // line 460
            if ((($context["export_type"] ?? null) == "server")) {
                // line 461
                yield "                        ";
yield _gettext("Export databases as separate files");
                // line 462
                yield "                      ";
            } elseif ((($context["export_type"] ?? null) == "database")) {
                // line 463
                yield "                        ";
yield _gettext("Export tables as separate files");
                // line 464
                yield "                      ";
            }
            // line 465
            yield "                    </label>
                  </div>
                </li>
              ";
        }
        // line 469
        yield "            </ul>
          </div>
        </li>

        <li class=\"list-group-item\">
          <label for=\"maxsize\" class=\"form-label\">";
yield _gettext("Skip tables larger than:");
        // line 474
        yield "</label>
          <input class=\"form-control\" type=\"number\" id=\"maxsize\" name=\"maxsize\" aria-describedby=\"maxsizeHelp\">
          <div id=\"maxsizeHelp\" class=\"form-text\">";
yield _gettext("The size is measured in MiB.");
        // line 476
        yield "</div>
        </li>
      </ul>
    </div>

    <div class=\"card mb-3\" id=\"format_specific_opts\">
      <div class=\"card-header\">";
yield _gettext("Format-specific options:");
        // line 482
        yield "</div>
      <div class=\"card-body\">
        ";
        // line 484
        yield ($context["options"] ?? null);
        yield "
      </div>
    </div>

    ";
        // line 488
        if (($context["can_convert_kanji"] ?? null)) {
            // line 489
            yield "      ";
            // line 490
            yield "      <div class=\"card mb-3\" id=\"kanji_encoding\">
        <div class=\"card-header\">";
yield _gettext("Encoding Conversion:");
            // line 491
            yield "</div>
        <div class=\"card-body\">
          ";
            // line 493
            yield from             $this->loadTemplate("encoding/kanji_encoding_form.twig", "export.twig", 493)->unwrap()->yield($context);
            // line 494
            yield "        </div>
      </div>
    ";
        }
        // line 497
        yield "
    <div id=\"submit\">
      <input id=\"buttonGo\" class=\"btn btn-primary\" type=\"submit\" value=\"";
yield _gettext("Export");
        // line 499
        yield "\" data-exec-time-limit=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["exec_time_limit"] ?? null), "html", null, true);
        yield "\">
    </div>
  </form>
</div>
";
        return; yield '';
    }

    // line 4
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        return; yield '';
    }

    // line 10
    public function block_message($context, array $blocks = [])
    {
        $macros = $this->macros;
        return; yield '';
    }

    // line 133
    public function block_selection_options($context, array $blocks = [])
    {
        $macros = $this->macros;
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "export.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  1078 => 133,  1071 => 10,  1064 => 4,  1053 => 499,  1048 => 497,  1043 => 494,  1041 => 493,  1037 => 491,  1033 => 490,  1031 => 489,  1029 => 488,  1022 => 484,  1018 => 482,  1009 => 476,  1004 => 474,  996 => 469,  990 => 465,  987 => 464,  984 => 463,  981 => 462,  978 => 461,  976 => 460,  971 => 458,  968 => 457,  964 => 455,  962 => 454,  959 => 453,  953 => 451,  946 => 446,  942 => 444,  937 => 442,  935 => 441,  932 => 440,  928 => 438,  923 => 436,  921 => 435,  919 => 434,  916 => 433,  909 => 429,  903 => 426,  901 => 425,  898 => 424,  891 => 419,  884 => 417,  882 => 416,  879 => 415,  875 => 414,  871 => 413,  865 => 409,  859 => 406,  857 => 405,  849 => 399,  843 => 396,  836 => 392,  828 => 388,  820 => 382,  814 => 378,  808 => 375,  801 => 370,  796 => 368,  792 => 366,  790 => 365,  783 => 360,  778 => 359,  773 => 356,  768 => 355,  763 => 352,  755 => 347,  750 => 345,  746 => 342,  744 => 341,  738 => 337,  733 => 336,  727 => 332,  717 => 325,  707 => 317,  701 => 314,  690 => 306,  682 => 301,  676 => 298,  665 => 290,  657 => 285,  651 => 282,  640 => 274,  632 => 269,  620 => 260,  609 => 252,  605 => 249,  599 => 248,  593 => 247,  584 => 243,  571 => 240,  562 => 238,  559 => 237,  555 => 236,  551 => 235,  548 => 234,  542 => 230,  531 => 227,  524 => 225,  521 => 224,  517 => 223,  514 => 222,  510 => 221,  507 => 220,  501 => 216,  492 => 213,  487 => 211,  484 => 210,  480 => 209,  477 => 208,  473 => 207,  466 => 202,  456 => 194,  452 => 193,  444 => 188,  437 => 183,  431 => 180,  424 => 175,  419 => 173,  414 => 170,  410 => 169,  408 => 168,  405 => 167,  396 => 161,  393 => 160,  387 => 157,  384 => 156,  381 => 154,  379 => 153,  377 => 152,  375 => 151,  372 => 149,  365 => 145,  360 => 144,  355 => 141,  350 => 140,  345 => 137,  341 => 136,  339 => 135,  336 => 134,  334 => 133,  329 => 130,  318 => 128,  314 => 127,  310 => 125,  297 => 123,  293 => 122,  290 => 121,  285 => 119,  280 => 117,  273 => 112,  268 => 111,  263 => 108,  258 => 107,  253 => 104,  249 => 103,  247 => 102,  242 => 100,  238 => 99,  235 => 98,  227 => 92,  218 => 87,  211 => 82,  207 => 81,  193 => 72,  188 => 68,  185 => 67,  181 => 64,  179 => 63,  176 => 62,  163 => 54,  155 => 51,  150 => 48,  141 => 45,  134 => 44,  130 => 43,  127 => 42,  120 => 38,  114 => 35,  103 => 27,  97 => 24,  91 => 21,  85 => 18,  79 => 16,  75 => 14,  71 => 13,  69 => 12,  66 => 11,  64 => 10,  59 => 8,  55 => 7,  51 => 5,  49 => 4,  45 => 3,  41 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "export.twig", "C:\\wamp64\\www\\nubuilder4\\core\\libs\\nudb\\templates\\export.twig");
    }
}
