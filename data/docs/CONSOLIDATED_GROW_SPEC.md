# PropBase • Grow Module - Complete Specification

## Overview
This document consolidates all epics and requirements for the PropBase Grow module into a single comprehensive specification. It serves as the complete reference for all planned functionality and implementation requirements.

## 0) Objectives (MVP)
- Enable suburb-first and property-first flows with one properties trigger.
- Keep friction low via default strategy + saved searches.
- Make scope/strategy/search visible & editable from the Grow Top Bar.
- Ensure mobile parity (no hover dependencies for core actions).

## 1) Scope (what changes now)
- Add Grow Top Bar with Search field and chips (Strategy / Search / Location).
- Switch map to hover = outline only, click = opens toolkit (no hover popups).
- Add Primary FAB: "Show Properties Here" (combined suburb/viewport logic).
- Add Secondary FAB: "Layers" (MVP: School catchments).
- Implement Suburb Strategy View as single entry via Strategy chip ("Adjust Strategy…").
- Implement Suburb List View (ranked by score).
- Implement Property Filter/Strategy View + Saved Search defaults + "Skip filters when default" preference.
- Ensure Properties View shows mini suburb score on cards.
- Implement Compare View (Suburbs | Properties) basic side-by-side.
- Persist user context (strategy, search, location, map bbox).

## 2) Complete Epic Breakdown

### Epic A — Grow Top Bar
**A1. Top Bar: Search field (location)**
- Accept suburb/state/postcode; autocompletion.
- On select: map zooms to bounds; Location chip updates.
- AC: Search works from any Grow view. Selecting "Brunswick 3056" centers and highlights suburb; Location chip updates.

**A2. Top Bar: Strategy chip**
- Shows current preset name; menu options: Switch preset, Adjust Strategy…, Manage presets.
- AC: Menu opens on all views; after "Adjust Strategy… → Save", map recolours.

**A3. Top Bar: Search (Saved Search) chip**
- Shows active saved search name in properties flows; menu: Switch saved search, Manage searches, Edit filters.
- AC: When not in properties flows, chip disabled or hidden.

**A4. Top Bar: Location chip**
- States: All Suburbs / Suburb: X / Map Area.
- Click actions: Clear scope, Switch to viewport, Switch to suburb, Focus search.
- AC: Always reflects current scope; changes update map/results.

### Epic B — Map Interactions & FABs
**B1. Hover/Click behaviour**
- Desktop hover: orange outline only, no tooltip.
- Click: lock selected; open suburb toolkit popover with name + score, 2–3 KPIs, CTAs: View Suburb, Show Properties, Add to Compare.
- AC: No accidental popups; toolkit actions navigate correctly.

**B2. Primary FAB: "Show Properties Here" (combined)**
- Logic: if suburb selected → locationFilter=suburb; else → locationFilter=viewport.
- Routing: if default saved search exists and skipFiltersWhenDefault=true → Properties View; else → Property Filter/Strategy View.
- AC: Same FAB on Map and Suburb View right rail; always opens correct scope.

**B3. Secondary FAB: Layers**
- MVP: Toggle School catchments overlay (on/off persisted per session).
- AC: Overlay draws above polygons; map clicks still work.

### Epic C — Strategy & Suburb Views
**C1. Suburb Strategy View**
- Quick profile (goal, risk, horizon, budget, location prefs, property type opt).
- KPI sliders with live preview.
- Actions: Save, Save as Preset, Set as Default.
- AC: Save updates preset and recolours map; default auto-applies on load.

**C2. Suburb List View**
- Columns: Suburb, Score, Yield, Vacancy, 5y Growth, SEIFA, Stock on Market.
- Controls: sort, min/max filters, CSV export.
- Row actions: View Suburb, Center on Map, Add to Compare.
- AC: Sorting/filters match strategy; "Center on Map" highlights polygon.

**C3. Suburb View (detail)**
- Header: Name + score; Watchlist toggle.
- Tabs: Overview, Trends, Demographics, Infrastructure.
- Right rail CTAs: Show Properties Here, Add to Compare, Adjust Strategy.
- AC: Charts render; CTAs route correctly.

### Epic D — Properties & Filters
**D1. Property Filter/Strategy View**
- Read-only Location summary chip.
- Filters: price, beds, baths, parking, type, land size, keywords.
- Toggles: High yield, Under median, Long DOM, Dev hints.
- Actions: Apply, Save Search, Set as Default, Skip filters toggle.
- AC: Apply goes to Properties View; default saved search used in FAB routing.

**D2. Properties View**
- Toolbar: result count, sort (Newest, Price, Yield est., Price vs Median), chips (Strategy/Search/Location).
- Cards: image, title, price, features, mini suburb score, KPIs.
- Actions: Save, Add to Compare, View Details.
- AC: Sorting works; score matches suburb.

**D3. Property View (detail)**
- Left: gallery, description, features.
- Right rail: Suburb KPI panel, View Suburb on Map, Add to Compare, Similar in this suburb.
- AC: View Suburb on Map navigates correctly.

### Epic E — Compare
**E1. Compare View**
- Mode: Suburbs | Properties.
- Suburbs: columns per suburb; rows = KPIs, highlight best.
- Properties: columns per property; rows = features, yield, price vs median, DOM, suburb score.
- Actions: remove, reorder, export.
- AC: Add/remove/reorder works; export valid.

### Epic F — Persistence & Preferences
**F1. Persisted state**
- Strategy preset, saved search, map bbox/zoom, selected suburb, layers toggle, skipFiltersWhenDefault.
- AC: Reload restores prior context in <300ms.

### Epic G — Error Handling & User Experience
**G1. Error Recovery & Feedback**
- Toast notifications for user actions (save, compare, etc.).
- Error messages for API failures with retry options.
- Loading states for all async operations.
- Graceful degradation when data unavailable.
- Offline mode with cached data display.
- AC: Users receive clear feedback for all actions; errors are recoverable.

**G2. Accessibility Compliance**
- WCAG 2.1 AA compliance.
- Full keyboard navigation support.
- Screen reader compatibility.
- High contrast mode support.
- Focus indicators for all interactive elements.
- AC: App is fully accessible to users with disabilities.

**G3. Performance Requirements**
- Virtual scrolling for lists >100 items.
- Progressive image loading with placeholders.
- Code splitting for non-critical components.
- API response caching (5 minutes).
- Bundle size <2MB initial load.
- AC: App loads in <3 seconds on 3G connection.

**G4. Mobile Experience**
- Touch gestures for map interaction.
- Bottom sheet navigation for mobile.
- Location-based search using GPS.
- Camera integration for property photos.
- Offline-first data caching.
- AC: App provides native-like experience on mobile devices.

**G5. Data Validation & Security**
- Real-time form validation with error messages.
- Input sanitization and XSS prevention.
- Data type and boundary validation.
- Cross-field validation (e.g., price min < max).
- Security headers and CSRF protection.
- AC: All user inputs are validated and secure.

**G6. Advanced Search & Discovery**
- Boolean search operators (AND, OR, NOT).
- Complex filter combinations with logic.
- Search history and popular searches.
- AI-powered search suggestions.
- Search analytics and insights.
- AC: Users can find properties using advanced search criteria.

**G7. Real-Time Features**
- Live property price updates.
- Push notifications for alerts.
- Real-time collaboration features.
- Live chat with agents.
- WebSocket integration for live data.
- AC: Users receive real-time updates and can collaborate.

**G8. Internationalization**
- Multi-language support (EN, ES, FR, DE).
- Currency localization.
- Local date/time formatting.
- RTL language support.
- Cultural property type adaptations.
- AC: App supports multiple languages and cultures.

**G9. Analytics & Insights**
- User behavior tracking and heatmaps.
- Market trend analysis and predictions.
- Personalized property recommendations.
- Performance and conversion analytics.
- A/B testing framework for features.
- AC: App provides insights and personalized recommendations.

**G10. Security & Privacy**
- GDPR compliance and data privacy.
- Multi-factor authentication.
- Role-based access control.
- End-to-end data encryption.
- Comprehensive audit logging.
- AC: User data is secure and privacy-compliant.

### Epic H — User Data & Alerts
**H1. Persistent Watchlist**
- Save suburbs and properties to user's watchlist.
- Manage watchlist (view, remove, organize, categorize).
- Watchlist dashboard with saved items overview.
- API integration for persistent storage.
- AC: Users can save and manage their favorite suburbs and properties.

**H2. Alerts System**
- Price change alerts for saved properties.
- New property alerts in watched suburbs.
- Strategy match alerts (new suburbs matching user's strategy).
- Filter match alerts (new properties matching user's filters).
- Email/push notification system.
- Alert preferences and settings.
- AC: Users receive timely notifications about relevant market changes.

**H3. Search History & Activity**
- Track recent searches with timestamps.
- Recently viewed properties and suburbs.
- Search history with quick re-run capability.
- Activity timeline and insights.
- AC: Users can easily access their recent activity and re-run searches.

**H4. User Activity Dashboard**
- Overview of saved items and recent activity.
- Quick access to watchlist and search history.
- Activity insights and recommendations.
- Export activity data.
- AC: Users have a central place to view their activity and saved items.

## 3) UX Rules
- Defaults first: new users see Balanced Metro strategy.
- One properties trigger via FAB.
- Chips always reflect current state; clickable to change.
- Hover decorative only; click opens panel.
- Mobile parity.

## 4) Data & Calculations
- Suburb score = weighted KPI sum (normalized 0–100).
- Mini suburb score = same as suburb polygon.
- Estimated yield = (annual rent / price) × 100.

## 5) Analytics
Track: strategy_preset_selected, strategy_adjust_opened, strategy_saved, map_show_properties_here_clicked, topbar_location_changed, properties_saved_search_set_default, properties_filters_skipped_via_default, compare_add, layers_toggled, error_occurred, performance_metrics, accessibility_usage, mobile_interaction, search_analytics, real_time_updates, internationalization_usage, security_events, privacy_compliance, watchlist_add, watchlist_remove, alert_created, alert_triggered, search_history_saved, activity_viewed, user_dashboard_accessed.

## 6) QA Checklist
- Top Bar: search, chips, menus correct.
- Map: hover outline only, click opens panel, chip syncs.
- FABs: correct routing, toggle layers persists.
- Strategy View: sliders adjust, save recolours.
- Suburb List/View: sorting/filters, CTAs route.
- Properties & Filters: prefill, skip preference respected, scores correct.
- Compare: add/remove/reorder, mode toggle, export valid.
- Persistence: reload restores state.
- Accessibility: tabbable, focus order logical, hit areas >=44px.
- Error Handling: toast notifications, error recovery, loading states.
- Performance: load time <3s, virtual scrolling, image optimization.
- Mobile: touch gestures, responsive design, mobile navigation.
- Security: input validation, XSS prevention, data sanitization.
- Search: advanced filters, search history, AI suggestions.
- Real-time: live updates, notifications, collaboration features.
- Internationalization: multi-language, currency, date formatting.
- Analytics: user tracking, insights, A/B testing.
- Privacy: GDPR compliance, data encryption, audit logging.
- Watchlist: save, manage, organize suburbs and properties.
- Alerts: price changes, new properties, strategy matches.
- Activity: search history, recent views, activity timeline.
- User Dashboard: saved items, activity overview, insights.

## 7) Risks & Mitigations
- Accidental popups: click-only panels.
- Scope confusion: Location chip + unified FAB.
- Performance: debounce slider changes.
- Data gaps: hide missing KPI, adjust weight normalization.

## 8) Content & Microcopy
- FAB: Show Properties Here
- Strategy chip: Strategy: {name}, menu Adjust Strategy…
- Location chip: All Suburbs / Suburb: {name} / Map Area
- Toolkit CTAs: View Suburb, Show Properties, Add to Compare
- Filters toggle: Skip filter screens when default search is set

## 9) Deliverables Checklist
- Grow Top Bar variations
- Suburb click toolkit
- FAB stack placement
- Suburb Strategy View
- Suburb List table
- Property Filter/Strategy View
- Properties card layout
- Compare View (both modes)

## 10) Implementation Status

### ✅ Completed Features
- **Map Interactions**: Hover highlighting, click tooltips, suburb selection
- **Search System**: Suburb search with autocomplete, state-aware filtering
- **UI Components**: Chip layout, text overflow handling, visual design
- **Performance**: Optimized hover updates, search debouncing, memory management

### 🔄 Partially Implemented
- **Property Data Integration**: Basic structure exists, needs real API connections
- **Compare Functionality**: UI components exist, needs item management
- **Property Management**: Basic structure exists, needs save/compare features

### 📋 Not Yet Implemented
- **Epic G**: Error handling, accessibility, performance optimizations
- **Epic H**: User data, alerts, activity tracking
- **Advanced Features**: AI recommendations, real-time updates, internationalization

## 11) Next Development Priorities

### Phase 1: Core Data Integration
1. Implement real property data fetching
2. Connect to backend APIs
3. Replace mock data with real sources

### Phase 2: Enhanced User Experience
1. Implement comprehensive error handling (Epic G1-G2)
2. Add accessibility compliance (Epic G2)
3. Enhance performance features (Epic G3)

### Phase 3: Advanced Features
1. Implement user data management (Epic H1-H4)
2. Add alerts and notifications (Epic H2)
3. Enhance search and discovery (Epic G6)

### Phase 4: Production Readiness
1. Security and privacy compliance (Epic G10)
2. Analytics and insights (Epic G9)
3. Internationalization support (Epic G8)

---

*This document consolidates all requirements from the original grow-spec.md and serves as the single source of truth for all Grow module functionality.*
